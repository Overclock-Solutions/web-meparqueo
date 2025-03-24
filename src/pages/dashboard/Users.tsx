import { useEffect } from 'react';
import CrudModel from '../../components/CrudModel';
import { useUserStore } from '../../store/user/userStore';
import { GlobalStatus, Role, User } from '../../store/models';
import HeadPage from '../../components/HeadPage';
import { notifications } from '@mantine/notifications';
import { Button, Drawer, PasswordInput } from '@mantine/core';
import { IconPassword } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

const Users = () => {
  const {
    users,
    loading,
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    changePassword,
    errors,
    clearError,
  } = useUserStore();
  const [
    openedPanelUpdatePass,
    { open: openPanelUpdatePass, close: closePanelUpdatePass },
  ] = useDisclosure(false);

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [users.length, getUsers]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        notifications.show({
          title: 'Error',
          message: error,
          color: 'red',
        });
      });
      clearError();
    }
  }, [errors, clearError]);

  const handleCreate = async (userData: Partial<User>) => {
    const createDto = {
      email: userData.email || '',
      password: userData.password || '',
      role: userData.role || Role.USER,
      names: userData.person?.names || '',
      lastnames: userData.person?.lastNames || '',
      phone: userData.person?.phone || '',
      globalStatus: userData.globalStatus,
    };
    await createUser(createDto);
  };

  const handleUpdate = async (userData: Partial<User>) => {
    if (!userData.id) throw new Error('ID de usuario no proporcionado');

    const updateDto = {
      email: userData.email || '',
      role: userData.role || Role.USER,
      names: userData.person?.names || '',
      lastNames: userData.person?.lastNames || '',
      phone: userData.person?.phone || '',
      globalStatus: userData.globalStatus,
    };
    await updateUser(userData.id, updateDto);
  };

  const handleDelete = async (userData: Partial<User>) => {
    if (!userData.id) throw new Error('ID de usuario no proporcionado');
    return await deleteUser(userData.id);
  };

  const buttonUpdatePass = (user: User) => (
    <Button
      px={4}
      variant="default"
      size="xs"
      onClick={() => handleUpdatePass(user)}
    >
      <IconPassword color="gray" />
    </Button>
  );

  const form = useForm({
    initialValues: {
      id: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleUpdatePass = (user: User) => {
    form.setValues({
      id: user.id,
      password: '',
      confirmPassword: '',
    });
    openPanelUpdatePass();
  };

  const handleSubmit = () => {
    if (form.values.password === form.values.confirmPassword) {
      changePassword(form.values.id, {
        password: form.values.password,
      }).then(() => {
        notifications.show({
          title: 'Éxito',
          message: 'Contraseña actualizada correctamente',
          color: 'green',
        });
        closePanelUpdatePass();
        form.reset();
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Las contraseñas no coinciden',
        color: 'red',
      });
    }
  };

  return (
    <>
      <HeadPage
        title="Usuarios"
        beforePath={[{ title: 'Dashboard', path: '/dashboard' }]}
      />
      <CrudModel<User>
        model={{
          name: 'Usuarios',
          columns: [
            {
              type: 'text',
              accessorKey: 'person.names',
              header: 'Nombres',
              required: true,
              accessorFn: (row) => row.person?.names,
            },
            {
              type: 'text',
              accessorKey: 'person.lastNames',
              header: 'Apellidos',
              required: true,
              accessorFn: (row) => row.person?.lastNames,
            },
            {
              type: 'text',
              accessorKey: 'person.phone',
              header: 'Teléfono',
              required: true,
              accessorFn: (row) => row.person?.phone,
            },
            {
              type: 'text',
              accessorKey: 'email',
              header: 'Email',
              required: true,
            },
            {
              type: 'password',
              accessorKey: 'password',
              header: 'Contraseña',
              required: true,
              disabled: false,
            },
            {
              type: 'select',
              accessorKey: 'role',
              header: 'Rol',
              options: [
                { label: 'Admin', value: Role.ADMIN },
                { label: 'Dueño', value: Role.OWNER },
                { label: 'Usuario', value: Role.USER },
              ],
              searchable: true,
            },
            {
              type: 'select',
              accessorKey: 'globalStatus',
              header: 'Estado',
              options: [
                { label: 'Activo', value: GlobalStatus.ACTIVE },
                { label: 'Inactivo', value: GlobalStatus.INACTIVE },
                { label: 'Archivado', value: GlobalStatus.ARCHIVED },
              ],
              required: true,
              searchable: true,
            },
            {
              type: 'date',
              accessorKey: 'createdAt',
              header: 'Fecha de Creación',
            },
          ],
          initialValues: {
            email: '',
            password: '',
            role: Role.OWNER,
            person: {
              names: '',
              lastNames: '',
              phone: '',
            },
            globalStatus: GlobalStatus.ACTIVE,
          },
        }}
        data={users}
        isLoading={loading.get}
        isCreating={loading.create}
        isUpdating={loading.update}
        isDeleting={loading.delete}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRefresh={getUsers}
        successMessage="Operación exitosa"
        errorMessage="Error al procesar la solicitud"
        customButtonAction={buttonUpdatePass}
      />

      <Drawer
        opened={openedPanelUpdatePass}
        onClose={() => {
          closePanelUpdatePass();
          form.reset();
        }}
        title="Actualizar contraseña"
        overlayProps={{ opacity: 0.5, blur: 1 }}
        position="right"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <PasswordInput
            key="password"
            label="Contraseña"
            {...form.getInputProps('password')}
            required
            mb={4}
          />
          <PasswordInput
            key="confirmPassword"
            label="Confirmacion"
            {...form.getInputProps('confirmPassword')}
            required
            mb={4}
          />
          <Button loading={loading.update} type="submit" mt="md">
            Actualizar contraseña
          </Button>
        </form>
      </Drawer>
    </>
  );
};

export default Users;
