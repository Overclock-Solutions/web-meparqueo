import { useEffect } from 'react';
import CrudModel from '../../components/CrudModel';
import { useUserStore } from '../../store/user/userStore';
import { GlobalStatus, Role, User } from '../../store/models';
import HeadPage from '../../components/HeadPage';
import { notifications } from '@mantine/notifications';

const Users = () => {
  const {
    users,
    loading,
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    errors,
    clearError,
  } = useUserStore();

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
      />
    </>
  );
};

export default Users;
