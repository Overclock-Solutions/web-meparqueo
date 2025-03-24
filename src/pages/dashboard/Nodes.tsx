import { useEffect } from 'react';
import CrudModel from '../../components/CrudModel';
import { useNodeStore } from '../../store/node/nodeStore';
import { Node, GlobalStatus, NodeVersion } from '../../store/models';
import HeadPage from '../../components/HeadPage';
import { notifications } from '@mantine/notifications';

const Nodes = () => {
  const {
    nodes,
    loading,
    createNode,
    getNodes,
    updateNode,
    deleteNode,
    errors,
    clearError,
  } = useNodeStore();

  useEffect(() => {
    if (nodes.length === 0) {
      getNodes();
    }
  }, [nodes.length, getNodes]);

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

  const handleCreate = async (nodeData: Partial<Node>) => {
    const createDto = {
      code: nodeData.code || '',
      version: nodeData.version || NodeVersion.BETA,
      globalStatus: nodeData.globalStatus || GlobalStatus.ACTIVE,
    };
    await createNode(createDto);
  };

  const handleUpdate = async (nodeData: Partial<Node>) => {
    if (!nodeData.id) throw new Error('ID del nodo no proporcionado');

    const updateDto = {
      code: nodeData.code || '',
      version: nodeData.version || NodeVersion.BETA,
      globalStatus: nodeData.globalStatus || GlobalStatus.ACTIVE,
    };
    await updateNode(nodeData.id, updateDto);
  };

  const handleDelete = async (nodeData: Partial<Node>) => {
    if (!nodeData.id) throw new Error('ID del nodo no proporcionado');
    return await deleteNode(nodeData.id);
  };

  return (
    <>
      <HeadPage
        title="Nodos"
        beforePath={[
          { title: 'Dashboard', path: '/dashboard' },
          { title: 'Parqueaderos', path: '/dashboard/parqueaderos' },
        ]}
      />
      <CrudModel<Node>
        model={{
          name: 'Nodos',
          columns: [
            {
              type: 'text',
              accessorKey: 'code',
              header: 'Código',
              required: true,
            },
            {
              type: 'select',
              accessorKey: 'version',
              header: 'Versión',
              options: [
                { label: 'Beta', value: NodeVersion.BETA },
                { label: 'V1', value: NodeVersion.V1 },
                { label: 'V2', value: NodeVersion.V2 },
              ],
              required: true,
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
            code: '',
            version: NodeVersion.BETA,
            globalStatus: GlobalStatus.ACTIVE,
          },
        }}
        data={nodes}
        isLoading={loading.get}
        isCreating={loading.create}
        isUpdating={loading.update}
        isDeleting={loading.delete}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRefresh={getNodes}
        successMessage="Operación exitosa"
        errorMessage="Error al procesar la solicitud"
      />
    </>
  );
};

export default Nodes;
