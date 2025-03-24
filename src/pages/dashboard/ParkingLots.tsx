import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import {
  Button,
  Drawer,
  TextInput,
  Textarea,
  Dialog,
  Text,
  Badge,
  Select,
  NumberInput,
  MultiSelect,
  FileInput,
  Group,
  Box,
  Tooltip,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconUpload,
  IconRefresh,
  IconPencil,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useParkingLotStore } from '../../store/parkingLot/parkingLotStore';
import { useUserStore } from '../../store/user/userStore';
import { useNodeStore } from '../../store/node/nodeStore';
import {
  GlobalStatus,
  ParkingLot,
  ParkingLotAvailability,
  ParkingLotStatus,
  Role,
  User,
} from '../../store/models';
import { API_ENDPOINTS } from '../../types/api';
import api from '../../service/api';
import HeadPage from '../../components/HeadPage';
import { sanitizeParkingLotData } from '../../store/parkingLot/types';

const ParkingLotsView = () => {
  const {
    parkingLots,
    loading,
    errors,
    createParkingLot,
    getParkingLots,
    updateParkingLot,
    deleteParkingLot,
    clearError,
  } = useParkingLotStore();

  const { users: usersStore, getUsers, getUsersByRole } = useUserStore();
  const { nodes, getNodes } = useNodeStore();
  const [owners, setOwners] = useState<User[]>([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLot | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    { key: string; url: string }[]
  >([]);

  const form = useForm<ParkingLot>({
    initialValues: {
      id: '',
      code: '',
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      price: 0,
      phoneNumber: '',
      status: ParkingLotStatus.OPEN,
      paymentMethods: [],
      services: [],
      ownerId: '',
      nodeIds: [],
      availability: ParkingLotAvailability.NO_AVAILABILITY,
      globalStatus: GlobalStatus.ACTIVE,
    },

    validate: {
      code: (value) => (value.length < 3 ? 'Código muy corto' : null),
      name: (value) => (value.length < 5 ? 'Nombre muy corto' : null),
      ownerId: (value) => (!value ? 'Seleccione un propietario' : null),
    },
  });

  useEffect(() => {
    if (parkingLots.length === 0) {
      getParkingLots();
    }
    if (usersStore.length === 0) {
      getUsers();
    }
    if (nodes.length === 0) {
      getNodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOwners(getUsersByRole(Role.OWNER));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersStore]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        notifications.show({ title: 'Error', message: error, color: 'red' });
      });
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const handleUploadImages = async () => {
    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'parking-lots');

      const response = await api.post(API_ENDPOINTS.files.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      uploadedImages.push(response.data.data);
    }
    return uploadedImages;
  };

  const handleDeleteImages = async (keys: string[]) => {
    await Promise.all(
      keys.map((key) => api.post(API_ENDPOINTS.files.delete, { fileId: key })),
    );
  };

  const handleSubmit = async (values: ParkingLot) => {
    try {
      let images = existingImages;

      if (files.length > 0) {
        const newImages = await handleUploadImages();
        images = [...existingImages, ...newImages];
      }

      const parkingLotData = sanitizeParkingLotData({
        ...values,
        images,
      });

      if (editMode && values.id) {
        await updateParkingLot(values.id, parkingLotData);
      } else {
        await createParkingLot(parkingLotData);
      }

      notifications.show({
        title: 'Éxito',
        message: `Parqueadero ${editMode ? 'actualizado' : 'creado'} correctamente`,
        color: 'teal',
      });

      closeForm();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Ocurrió un error procesando la solicitud',
        color: 'red',
      });
    }
  };

  const openEdit = (parkingLot: ParkingLot) => {
    form.setValues({
      ...parkingLot,
      nodeIds: parkingLot.nodeIds || [],
    });
    setExistingImages(parkingLot.images || []);
    setEditMode(true);
    open();
  };

  const openCreate = () => {
    form.reset();
    setExistingImages([]);
    setFiles([]);
    setEditMode(false);
    open();
  };

  const closeForm = () => {
    close();
    form.reset();
    setSelectedParkingLot(null);
  };

  const handleDelete = async (id: string) => {
    const parkingLot = parkingLots.find((p) => p.id === id);
    if (parkingLot?.images?.length) {
      await handleDeleteImages(parkingLot.images.map((img) => img.key));
    }
    await deleteParkingLot(id);
  };

  const onRefresh = async () => {
    getParkingLots();
    console.log(parkingLots[0].nodeIds);
  };

  const columns = useMemo<MRT_ColumnDef<ParkingLot>[]>(
    () => [
      { accessorKey: 'code', header: 'Código' },
      { accessorKey: 'name', header: 'Nombre' },
      { accessorKey: 'address', header: 'Dirección' },
      {
        accessorKey: 'ownerId',
        header: 'Propietario',
        Cell: ({ row }) => {
          const owner = owners.find((o) => o.id === row.original.ownerId);
          return owner
            ? `${owner.person?.names} ${owner.person?.lastNames}`
            : '-';
        },
      },
      {
        accessorKey: 'nodeIds',
        header: 'Nodos asociados',
        Cell: ({ row }) => {
          const nodeIds = row.original.nodeIds || [];
          return nodes
            .filter((node) => nodeIds.includes(node.id || ''))
            .map((node) => node.code)
            .join(', ');
        },
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ row }) => (
          <Badge
            color={
              row.original.status === ParkingLotStatus.OPEN ? 'green' : 'red'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Acciones',
        Cell: ({ row }) => (
          <Button.Group>
            <Button
              px={4}
              variant="default"
              size="xs"
              onClick={() => openEdit(row.original)}
            >
              <IconPencil color="orange" />
            </Button>
            <Button
              px={4}
              variant="default"
              size="xs"
              onClick={() => handleDelete(row.original.id)}
            >
              <IconTrash color="red" />
            </Button>
          </Button.Group>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [owners],
  );

  const table = useMantineReactTable({
    columns,
    data: parkingLots,
    state: { isLoading: loading.get },
    localization: {
      noRecordsToDisplay: 'No hay parqueaderos registrados',
    },
    enablePagination: false,
    enableFullScreenToggle: false,
  });

  return (
    <>
      <HeadPage
        title="Parqueaderos"
        beforePath={[{ title: 'Dashboard', path: '/dashboard' }]}
      />

      <Box mb="sm">
        <Button
          leftIcon={<IconPlus />}
          onClick={openCreate}
          mx={2}
          color="teal"
        >
          Agregar
        </Button>
        <Tooltip label="Actualizar registros">
          <Button onClick={onRefresh} mx={2} color="orange">
            <IconRefresh className={loading.get ? `icon spinning ` : 'icon'} />
          </Button>
        </Tooltip>
      </Box>

      <MantineReactTable table={table} />

      <Drawer
        position="right"
        size="xl"
        opened={opened}
        onClose={closeForm}
        title={`${editMode ? 'Editar' : 'Nuevo'} Parqueadero`}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Código" {...form.getInputProps('code')} mb="sm" />

          <TextInput label="Nombre" {...form.getInputProps('name')} mb="sm" />

          <Textarea
            label="Dirección"
            {...form.getInputProps('address')}
            mb="sm"
          />

          <NumberInput
            label="Latitud"
            {...form.getInputProps('latitude')}
            mb="sm"
            precision={6}
          />

          <NumberInput
            label="Longitud"
            {...form.getInputProps('longitude')}
            mb="sm"
            precision={6}
          />

          <Select
            label="Propietario"
            data={owners.map((owner) => ({
              value: owner.id,
              label: `${owner.person?.names} ${owner.person?.lastNames}`,
            }))}
            {...form.getInputProps('ownerId')}
            mb="sm"
          />

          <MultiSelect
            label="Nodos asociados"
            data={nodes.map((node) => ({
              value: node.id || '',
              label: `${node.code} - ${node.version}`,
            }))}
            {...form.getInputProps('nodeIds')}
            mb="sm"
            searchable
            clearable
          />

          <NumberInput
            label="Precio por hora"
            {...form.getInputProps('price')}
            mb="sm"
            min={0}
          />

          <TextInput
            label="Teléfono"
            {...form.getInputProps('phoneNumber')}
            mb="sm"
          />

          <MultiSelect
            label="Métodos de pago"
            data={[
              { label: 'Efectivo', value: 'CASH' },
              { label: 'Tarjeta', value: 'CARD' },
              { label: 'Transferencia', value: 'TRANSFER' },
            ]}
            {...form.getInputProps('paymentMethods')}
            mb="sm"
          />

          <MultiSelect
            label="Servicios"
            data={[
              { label: 'Vigilancia', value: 'SECURITY' },
              { label: 'Cubierto', value: 'COVERED' },
              { label: 'Lavado', value: 'CAR_WASH' },
            ]}
            {...form.getInputProps('services')}
            mb="sm"
          />

          <FileInput
            label="Imágenes"
            multiple
            accept="image/*"
            onChange={setFiles}
            icon={<IconUpload size={18} />}
            mb="sm"
          />

          <Group mb="lg">
            {existingImages.map((image) => (
              <div key={image.key} style={{ position: 'relative' }}>
                <img
                  src={image.url}
                  alt={image.key}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    margin: 4,
                  }}
                />
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    padding: 2,
                    minWidth: 24,
                  }}
                  onClick={() =>
                    setExistingImages((prev) =>
                      prev.filter((img) => img.key !== image.key),
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </Group>

          <Group align="end" mt="md">
            <Button variant="default" onClick={closeForm}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading.create || loading.update}>
              {editMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </Group>
        </form>
      </Drawer>

      <Dialog
        opened={!!selectedParkingLot}
        onClose={() => setSelectedParkingLot(null)}
        withCloseButton
      >
        <Text>¿Estás seguro de eliminar este parqueadero?</Text>
        <Group align="end" mt="md">
          <Button variant="default" onClick={() => setSelectedParkingLot(null)}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={() =>
              selectedParkingLot && handleDelete(selectedParkingLot.id)
            }
          >
            Eliminar
          </Button>
        </Group>
      </Dialog>
    </>
  );
};

export default ParkingLotsView;
