import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Node,
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

// dnd kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Subcomponent: Debounced Number Input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DebouncedNumberInput = ({ value, onChange, ...props }: any) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(localValue), 500);
    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  return <NumberInput value={localValue} onChange={setLocalValue} {...props} />;
};

// Subcomponent: Image Preview (memoized)
const ImagePreview = React.memo(
  ({
    image,
    onRemove,
  }: {
    image: { key: string; url: string };
    onRemove: () => void;
  }) => (
    <div style={{ position: 'relative', margin: 4 }}>
      <img
        src={image.url}
        alt={image.key}
        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
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
        onClick={onRemove}
      >
        ×
      </Button>
    </div>
  ),
);

// Subcomponent: Sortable Image Preview con dnd kit
const SortableImagePreview = ({
  image,
  onRemove,
}: {
  image: { key: string; url: string };
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.key,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ImagePreview image={image} onRemove={onRemove} />
    </div>
  );
};

// Subcomponent: Form Fields (memoized)
const FormFields = React.memo(
  ({
    form,
    owners,
    nodes,
  }: {
    form: ReturnType<typeof useForm<ParkingLot>>;
    owners: User[];
    nodes: Node[];
  }) => (
    <>
      <TextInput label="Código" {...form.getInputProps('code')} mb="sm" />
      <TextInput label="Nombre" {...form.getInputProps('name')} mb="sm" />
      <Textarea label="Dirección" {...form.getInputProps('address')} mb="sm" />
      <DebouncedNumberInput
        label="Latitud"
        {...form.getInputProps('latitude')}
        mb="sm"
        precision={6}
      />
      <DebouncedNumberInput
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
    </>
  ),
);

const ParkingLots = () => {
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

  // Estado para imágenes separando las que ya están y las que se subirán (para lógica interna)
  const [imageState, setImageState] = useState<{
    existing: { key: string; url: string }[];
    toUpload: File[];
    toDelete: string[];
  }>({ existing: [], toUpload: [], toDelete: [] });

  // Nuevo estado para mantener el orden de las imágenes (combinando existentes y nuevas)
  const [orderedImages, setOrderedImages] = useState<
    { key: string; url: string; isNew: boolean; file?: File }[]
  >([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLot | null>(null);

  // Memoized form values and validations
  const form = useForm<ParkingLot>({
    initialValues: useMemo(
      () => ({
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
      }),
      [],
    ),
    validate: useMemo(
      () => ({
        code: (value) => (value.length < 3 ? 'Código muy corto' : null),
        name: (value) => (value.length < 5 ? 'Nombre muy corto' : null),
        ownerId: (value) => (!value ? 'Seleccione un propietario' : null),
      }),
      [],
    ),
  });

  // Load initial data in parallel
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          parkingLots.length === 0 && getParkingLots(),
          usersStore.length === 0 && getUsers(),
          nodes.length === 0 && getNodes(),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        notifications.show({ color: 'red', message: 'Error cargando datos' });
      }
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize owners based on usersStore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const owners = useMemo(() => getUsersByRole(Role.OWNER), [usersStore]);

  // Show errors as notifications
  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        notifications.show({ title: 'Error', message: error, color: 'red' });
      });
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  // Configurar sensors para dnd kit
  const sensors = useSensors(useSensor(PointerSensor));

  // Submit handler: se encarga de subir nuevas imágenes, combinar imágenes existentes y actualizar
  const handleSubmit = async (values: ParkingLot) => {
    try {
      // Si hay imágenes marcadas para eliminar (de imágenes existentes) se eliminan primero.
      if (imageState.toDelete.length > 0) {
        await Promise.all(
          imageState.toDelete.map((key) =>
            api.post(API_ENDPOINTS.files.delete, { fileId: key }),
          ),
        );
      }

      // Construir la lista final de imágenes en el orden definido por orderedImages.
      const finalImages = await Promise.all(
        orderedImages.map(async (img) => {
          if (!img.isNew) {
            // Imagen existente (ya fue subida previamente y no se eliminó)
            return img;
          } else {
            // Imagen nueva: se sube y se utiliza la respuesta
            const formData = new FormData();
            formData.append('file', img.file!);
            formData.append('path', 'parking-lots');
            const response = await api.post(
              API_ENDPOINTS.files.upload,
              formData,
            );
            return response.data.data;
          }
        }),
      );

      const parkingLotData = sanitizeParkingLotData({
        ...values,
        images: finalImages,
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

  // Actualiza el estado de imágenes y genera previsualizaciones para nuevos archivos
  const handleImageUpdate = useCallback((newFiles: File[]) => {
    // Para cada nuevo archivo se genera la previsualización y se marca como "isNew"
    const newPreviews = newFiles.map((file) => ({
      key: `preview-${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    // Actualiza la lógica interna para subir: agrega los nuevos archivos
    setImageState((prev) => ({
      ...prev,
      toUpload: [...prev.toUpload, ...newFiles],
    }));

    // Actualiza el orden de imágenes combinando las que ya existían con las nuevas
    setOrderedImages((prev) => [...prev, ...newPreviews]);
  }, []);

  // Elimina una imagen tanto del listado ordenado como del estado interno
  const handleImageRemove = (key: string) => {
    // Eliminar de orderedImages
    setOrderedImages((prev) => prev.filter((img) => img.key !== key));

    // Verificar si la imagen es existente o nueva
    if (imageState.existing.find((img) => img.key === key)) {
      // Si es existente, marcar para eliminar
      setImageState((prev) => ({
        ...prev,
        existing: prev.existing.filter((img) => img.key !== key),
        toDelete: [...prev.toDelete, key],
      }));
    } else {
      // Si es nueva, eliminar de la lista de archivos a subir
      const removed = orderedImages.find((img) => img.key === key);
      if (removed && removed.isNew && removed.file) {
        setImageState((prev) => ({
          ...prev,
          toUpload: prev.toUpload.filter((file) => file !== removed.file),
        }));
      }
    }
  };

  // Reordenar imágenes al finalizar el drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOrderedImages((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Al abrir en modo edición se cargan las imágenes existentes en orderedImages
  const openEdit = (parkingLot: ParkingLot) => {
    form.setValues({
      ...parkingLot,
      nodeIds: parkingLot.nodeIds || [],
    });
    const existingImgs = parkingLot.images || [];
    setImageState({
      existing: existingImgs,
      toUpload: [],
      toDelete: [],
    });
    setOrderedImages(existingImgs.map((img) => ({ ...img, isNew: false })));
    setEditMode(true);
    open();
  };

  // Abrir en modo creación reinicia formularios y estados
  const openCreate = () => {
    form.reset();
    setImageState({ existing: [], toUpload: [], toDelete: [] });
    setOrderedImages([]);
    setEditMode(false);
    open();
  };

  const closeForm = () => {
    close();
    form.reset();
    setSelectedParkingLot(null);
  };

  // Eliminar parqueadero
  const handleDelete = async (id: string) => {
    await deleteParkingLot(id);
  };

  const onRefresh = async () => {
    getParkingLots();
  };

  // Table columns definition with memoized owners and nodes options
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
    [owners, nodes],
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
            <IconRefresh className={loading.get ? 'icon spinning' : 'icon'} />
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
          <FormFields form={form} owners={owners} nodes={nodes} />

          <FileInput
            label="Imágenes"
            multiple
            accept="image/*"
            icon={<IconUpload size={18} />}
            mb="sm"
            onChange={(files) => {
              if (files && files.length > 0) {
                handleImageUpdate(files);
              }
            }}
          />

          {/* Envolver las previsualizaciones en DndContext para permitir reordenar */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedImages.map((img) => img.key)}
              strategy={verticalListSortingStrategy}
            >
              <Group mb="lg">
                {orderedImages.map((image) => (
                  <SortableImagePreview
                    key={image.key}
                    image={image}
                    onRemove={() => handleImageRemove(image.key)}
                  />
                ))}
              </Group>
            </SortableContext>
          </DndContext>

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

export default ParkingLots;
