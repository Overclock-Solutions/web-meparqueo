import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es';
import {
  Button,
  Drawer,
  TextInput,
  Textarea,
  Dialog,
  Text,
  Badge,
  Checkbox,
  Select,
  Tooltip,
  NumberInput,
  MultiSelect,
  Box,
  FileInput,
  PasswordInput,
} from '@mantine/core';
import {
  IconPencil,
  IconPlus,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { currency } from '../../helpers/helpers';
import './styles.css';

dayjs.extend(customParseFormat);

// Tipos
export type CrudColumn =
  | TextColumn
  | TextareaColumn
  | CheckboxColumn
  | SelectColumn
  | MultiSelectColumn
  | DateColumn
  | TimeColumn
  | NumberColumn
  | CurrencyColumn
  | PasswordColumn
  | FileColumn
  | CountItemsColumn;

type BaseColumn = {
  accessorKey: string;
  header: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accessorFn?: (row: any) => any;
};

type TextColumn = BaseColumn & { type: 'text' };
type TextareaColumn = BaseColumn & { type: 'textarea'; rows?: number };
type CheckboxColumn = BaseColumn & {
  type: 'checkbox';
  options: { label: string; value: string }[];
  accessorMap?: string;
};
type SelectColumn = BaseColumn & {
  type: 'select';
  options: { label: string; value: string }[];
  component?: { name: 'Badge' | 'Text'; color?: Record<string, string> };
};
type MultiSelectColumn = BaseColumn & {
  type: 'multiSelect';
  options: { label: string; value: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemComponent?: React.ComponentType<any>;
};
type DateColumn = BaseColumn & { type: 'date' };
type TimeColumn = BaseColumn & { type: 'time' };
type NumberColumn = BaseColumn & { type: 'number' };
type CurrencyColumn = BaseColumn & { type: 'currency' };
type PasswordColumn = BaseColumn & { type: 'password' };
type FileColumn = BaseColumn & {
  type: 'file';
  multiple?: boolean;
  previewComponent?: React.ComponentType<{ value: File | File[] }>;
};
type CountItemsColumn = BaseColumn & {
  type: 'countItems';
  imageAccessor?: string;
  nameAccessor?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type CrudModelConfig<T extends Record<string, any> = {}> = {
  name: string;
  columns: CrudColumn[];
  initialValues?: Partial<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CrudModelProps<T extends Record<string, any>> = {
  model: CrudModelConfig<T>;
  data: T[];
  isLoading?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onCreate?: (values: Partial<T>) => Promise<void>;
  onUpdate?: (values: Partial<T>) => Promise<void>;
  onDelete?: (values: Partial<T>) => Promise<void>;
  onRefresh?: () => void;
  successMessage?: string;
  errorMessage?: string;
  customButtonHeader?: React.ReactNode;
  customButtonAction?: (row: T) => React.ReactNode;
  enablePagination?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CrudModel = <T extends Record<string, any>>({
  model,
  data,
  isLoading = false,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
  onCreate,
  onUpdate,
  onDelete,
  onRefresh,
  successMessage = 'Operación exitosa',
  errorMessage = 'Error en la operación',
  customButtonHeader,
  customButtonAction,
  enablePagination = false,
}: CrudModelProps<T>) => {
  const [
    openedPanelCreateUpdate,
    { open: openPanelCreateUpdate, close: closePanelCreateUpdate },
  ] = useDisclosure(false);
  const [
    openedConfirmDelete,
    { open: openConfirmDelete, close: closeConfirmDelete },
  ] = useDisclosure(false);
  const [rowSelected, setRowSelected] = useState<T | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<Partial<T>>({
    initialValues:
      model.initialValues ||
      model.columns.reduce((acc, column) => {
        if (column.accessorKey.includes('.')) {
          const [nestedKey, childKey] = column.accessorKey.split('.');
          return {
            ...acc,
            [nestedKey]: {
              ...(acc[nestedKey as keyof T] as object),
              [childKey]: column.type === 'multiSelect' ? [] : '',
            },
          };
        }
        return {
          ...acc,
          [column.accessorKey]: column.type === 'multiSelect' ? [] : '',
        };
      }, {} as Partial<T>),
  });

  // Manejo de notificaciones
  const handleNotification = useCallback(
    (isSuccess: boolean) => {
      notifications.show({
        title: isSuccess ? 'Éxito' : 'Error',
        message: isSuccess ? successMessage : errorMessage,
        color: isSuccess ? 'teal' : 'red',
      });
    },
    [successMessage, errorMessage],
  );

  // Efectos de estado
  useEffect(() => {
    if (isCreating === false && isUpdating === false) {
      closePanelCreateUpdate();
      form.reset();
      setIsEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating, isUpdating]);

  useEffect(() => {
    if (isDeleting === false) {
      closeConfirmDelete();
      setRowSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleting]);

  // Handlers
  const handleSubmit = useCallback(
    async (values: Partial<T>) => {
      try {
        if (isEditing && onUpdate) {
          await onUpdate(values);
        } else if (onCreate) {
          await onCreate(values);
        }
        handleNotification(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        handleNotification(false);
      }
    },
    [isEditing, onCreate, onUpdate, handleNotification],
  );

  const handleDelete = useCallback(async () => {
    if (rowSelected && onDelete) {
      try {
        await onDelete(rowSelected);
        handleNotification(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        handleNotification(false);
      }
    }
  }, [rowSelected, onDelete, handleNotification]);

  const handleEdit = useCallback(
    (rowData: T) => {
      const processedData = model.columns.reduce((acc, column) => {
        if (column.type === 'checkbox' || column.type === 'multiSelect') {
          const value = rowData[column.accessorKey as keyof T];
          return {
            ...acc,
            [column.accessorKey]: Array.isArray(value)
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value.map((item: any) => item.value || item)
              : value,
          };
        }
        return acc;
      }, {} as Partial<T>);

      form.setValues({ ...rowData, ...processedData });
      setIsEditing(true);
      openPanelCreateUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model.columns, openPanelCreateUpdate, form.setValues],
  );

  // Columnas y tabla
  const actionColumn = useMemo<MRT_ColumnDef<T>>(
    () => ({
      accessorKey: 'actions',
      header: 'Acciones',
      Cell: ({ row }) => (
        <Button.Group>
          <Button
            px={4}
            variant="default"
            size="xs"
            onClick={() => handleEdit(row.original)}
          >
            <IconPencil color="orange" />
          </Button>
          <Button
            px={4}
            variant="default"
            size="xs"
            onClick={() => {
              setRowSelected(row.original);
              openConfirmDelete();
            }}
          >
            <IconTrash color="red" />
          </Button>
          {customButtonAction && customButtonAction(row.original)}
        </Button.Group>
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleEdit, customButtonAction],
  );

  const columns = useMemo<MRT_ColumnDef<T>[]>(() => {
    const mappedColumns = model.columns.map(
      (column): MRT_ColumnDef<T> | null => {
        const baseColumn: MRT_ColumnDef<T> = {
          accessorKey: column.accessorKey,
          header: column.header,
          accessorFn: column.accessorFn,
        };

        switch (column.type) {
          case 'textarea':
            return {
              ...baseColumn,
              Cell: ({ row }) => (
                <Box w={300}>
                  <Text truncate="end">{row.getValue(column.accessorKey)}</Text>
                </Box>
              ),
            };
          case 'checkbox':
            return {
              ...baseColumn,
              Cell: ({ row }) => (
                <>
                  {(row.getValue(column.accessorKey) as string[]).map(
                    (value) => {
                      const option = column.options.find(
                        (opt) => opt.value === value,
                      );
                      return (
                        <Badge key={value} color="orange">
                          {option?.label}
                        </Badge>
                      );
                    },
                  )}
                </>
              ),
            };
          case 'select':
            return {
              ...baseColumn,
              Cell: ({ row }) => {
                const value = row.getValue(column.accessorKey);
                const option = column.options.find(
                  (opt) => opt.value === value,
                );
                return column.component?.name === 'Badge' ? (
                  <Badge
                    color={
                      column.component.color?.[value as string] || 'orange'
                    }
                  >
                    {option?.label}
                  </Badge>
                ) : (
                  <Text>{option?.label}</Text>
                );
              },
            };
          case 'multiSelect':
            return {
              ...baseColumn,
              Cell: ({ row }) => (
                <>
                  {(row.getValue(column.accessorKey) as string[]).map(
                    (value) => {
                      const option = column.options.find(
                        (opt) => opt.value === value,
                      );
                      return (
                        <Badge key={value} color="orange">
                          {option?.label}
                        </Badge>
                      );
                    },
                  )}
                </>
              ),
            };
          case 'time':
            return {
              ...baseColumn,
              Cell: ({ row }) => (
                <Text>
                  {dayjs(row.getValue(column.accessorKey), 'HH:mm').format(
                    'hh:mm a',
                  )}
                </Text>
              ),
            };
          case 'date':
            return {
              ...baseColumn,
              Cell: ({ row }) => (
                <Text>
                  {dayjs(row.getValue(column.accessorKey)).format('DD/MM/YYYY')}
                </Text>
              ),
            };
          case 'currency':
            return {
              ...baseColumn,
              Cell: ({ row }) => currency(row.getValue(column.accessorKey)),
            };
          case 'password':
            return null;
          default:
            return baseColumn;
        }
      },
    );

    return [
      ...mappedColumns.filter((c): c is MRT_ColumnDef<T> => c !== null),
      actionColumn,
    ];
  }, [model.columns, actionColumn]);

  const table = useMantineReactTable({
    columns,
    data,
    enableFullScreenToggle: false,
    localization: MRT_Localization_ES,
    state: { isLoading },
    enablePagination: enablePagination,
  });

  return (
    <>
      <Box mb="sm">
        <Box mb="sm">
          <Button
            leftIcon={<IconPlus />}
            onClick={openPanelCreateUpdate}
            mx={2}
            color="teal"
          >
            Agregar
          </Button>
          {customButtonHeader}
          <Tooltip label="Actualizar registros">
            <Button onClick={onRefresh} mx={2} color="orange">
              <IconRefresh className={isLoading ? `icon spinning ` : 'icon'} />
            </Button>
          </Tooltip>
        </Box>

        <MantineReactTable table={table} />
      </Box>

      <Drawer
        opened={openedPanelCreateUpdate}
        onClose={() => {
          closePanelCreateUpdate();
          form.reset();
        }}
        title={`${isEditing ? 'Editar' : 'Agregar'} ${model.name}`}
        position="right"
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {model.columns.map((column) => {
            const commonProps = {
              label: column.header,
              required: column.required,
              disabled:
                column.disabled || (isEditing && column.type === 'password'),
              ...form.getInputProps(column.accessorKey),
            };

            switch (column.type) {
              case 'text':
                return <TextInput key={column.accessorKey} {...commonProps} />;
              case 'textarea':
                return (
                  <Textarea
                    key={column.accessorKey}
                    {...commonProps}
                    autosize
                    minRows={column.rows}
                  />
                );
              case 'checkbox':
                return (
                  <Checkbox.Group key={column.accessorKey} {...commonProps}>
                    {column.options.map((option) => (
                      <Checkbox
                        key={column.accessorKey}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Checkbox.Group>
                );
              case 'select':
                return (
                  <Select
                    key={column.accessorKey}
                    {...commonProps}
                    data={column.options}
                    searchable={column.searchable}
                  />
                );
              case 'multiSelect':
                return (
                  <MultiSelect
                    key={column.accessorKey}
                    {...commonProps}
                    data={column.options}
                    searchable={column.searchable}
                    itemComponent={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      column.itemComponent as React.FunctionComponent<any>
                    }
                  />
                );
              case 'number':
                return (
                  <NumberInput key={column.accessorKey} {...commonProps} />
                );
              case 'currency':
                return (
                  <NumberInput
                    key={column.accessorKey}
                    {...commonProps}
                    icon={<Text>$</Text>}
                  />
                );
              case 'file':
                return column.previewComponent ? (
                  <column.previewComponent
                    key={column.accessorKey}
                    value={
                      (form.values[column.accessorKey] as File | File[]) ??
                      (column.multiple ? [] : [])
                    }
                  />
                ) : (
                  <FileInput
                    key={column.accessorKey}
                    {...commonProps}
                    multiple={column.multiple}
                  />
                );
              case 'password':
                return (
                  <PasswordInput
                    key={column.accessorKey}
                    label={column.header}
                    {...form.getInputProps(column.accessorKey)}
                    required={column.required}
                    mb={4}
                    disabled={isEditing}
                  />
                );
              default:
                return null;
            }
          })}
          <Button type="submit" mt="md" loading={isCreating || isUpdating}>
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </form>
      </Drawer>

      <Dialog
        opened={openedConfirmDelete}
        onClose={closeConfirmDelete}
        size="lg"
        withCloseButton
      >
        <Text mb="md">¿Estás seguro de eliminar este registro?</Text>
        <Button color="red" onClick={handleDelete} loading={isDeleting}>
          Confirmar Eliminación
        </Button>
      </Dialog>
    </>
  );
};

export default React.memo(CrudModel) as typeof CrudModel;
