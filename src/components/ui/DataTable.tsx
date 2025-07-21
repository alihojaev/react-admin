import { useState } from 'react';
import cx from 'clsx';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconPlus, IconDots, IconEdit, IconTrash, IconFilter, IconSettings } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  keys,
  Menu,
  Modal,
  Pagination,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Select,
} from '@mantine/core';
import classes from './DataTable.module.css';

interface RowData {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  data: RowData[];
  columns: Column[];
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  showSettingsButton?: boolean;
  actions?: {
    edit?: (row: RowData) => void;
    delete?: (row: RowData) => void;
  };
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  align?: 'left' | 'center' | 'right';
}

function Th({ children, reversed, sorted, onSort, align = 'left' }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ textAlign: align }}>
      <div onClick={onSort} style={{ cursor: 'pointer' }}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </div>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string, columns: Column[]) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    columns.some((column) => {
      const value = item[column.key];
      return value && value.toString().toLowerCase().includes(query);
    })
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: string | null; reversed: boolean; search: string },
  columns: Column[]
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search, columns);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (payload.reversed) {
        return bValue.toString().localeCompare(aValue.toString());
      }

      return aValue.toString().localeCompare(bValue.toString());
    }),
    payload.search,
    columns
  );
}

export function DataTable({
  data,
  columns,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  addButton,
  showSettingsButton = false,
  actions,
  searchPlaceholder = "Search by any field",
  emptyMessage = "Нет записей для отображения",
  className
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);

  const handleSettingsClick = () => {
    console.log('Settings button clicked');
    // Здесь будет внутренняя логика настроек
  };

  const setSorting = (field: string) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }, columns));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }, columns));
  };

  const handleItemsPerPageChange = (value: string | null) => {
    if (value) {
      const newItemsPerPage = parseInt(value);
      setCurrentItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Сбрасываем на первую страницу при изменении размера
    }
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      {columns.map((column) => (
        <Table.Td key={column.key} style={{ textAlign: column.align || 'left' }}>
          {row[column.key]}
        </Table.Td>
      ))}
      {actions && (
        <Table.Td style={{ textAlign: 'end', width: 133 }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {actions.edit && (
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => actions.edit!(row)}>
                  Редактировать
                </Menu.Item>
              )}
              {actions.delete && (
                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => actions.delete!(row)}>
                  Удалить
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <div className={className}>
      {searchable && (
        <Group mb="md" gap="xs">
          <TextInput
            placeholder={searchPlaceholder}
            style={{ flex: 1 }}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <ActionIcon variant="light" size="lg">
            <IconFilter size={18} />
          </ActionIcon>
          <ActionIcon variant="light" size="lg">
            <IconSearch size={18} />
          </ActionIcon>
        </Group>
      )}
      
      <div style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-sm)' }}>
        <ScrollArea 
          h={Math.min(sortedData.length * 50 + 40, window.innerHeight - 320)} 
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table horizontalSpacing="md" verticalSpacing="xs" miw={800} layout="fixed">
            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
              <Table.Tr>
                {columns.map((column) => (
                  column.sortable ? (
                    <Th
                      key={column.key}
                      sorted={sortBy === column.key}
                      reversed={reverseSortDirection}
                      onSort={() => setSorting(column.key)}
                      align={column.align}
                    >
                      {column.label}
                    </Th>
                  ) : (
                    <Table.Th key={column.key} style={{ textAlign: column.align || 'left', width: column.width }}>
                      {column.label}
                    </Table.Th>
                  )
                ))}
                {(addButton || showSettingsButton) && (
                  <Table.Th style={{ textAlign: 'end', width: showSettingsButton ? 180 : 133 }}>
                    <Group gap="xs" justify="flex-end">
                      {showSettingsButton && (
                        <ActionIcon 
                          variant="light" 
                          size="md"
                          onClick={handleSettingsClick}
                        >
                          <IconSettings size={20} />
                        </ActionIcon>
                      )}
                      {addButton && (
                        <Button 
                          size="xs" 
                          leftSection={<IconPlus size={14} />}
                          onClick={addButton.onClick}
                        >
                          {addButton.label}
                        </Button>
                      )}
                    </Group>
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={columns.length + (addButton ? 1 : 0)}>
                    <Text fw={500} ta="center">
                      {emptyMessage}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </div>
      
      {pagination && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Показано
            </Text>
            <Select
              value={currentItemsPerPage.toString()}
              onChange={handleItemsPerPageChange}
              data={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '30', label: '30' },
              ]}
              size="xs"
              w={45}
              styles={{
                input: {
                  textAlign: 'center',
                  padding: '4px 20px 4px 8px',
                  cursor: 'default',
                  caretColor: 'transparent',
                }
              }}
              renderOption={({ option, ...others }) => (
                <div {...others} style={{ padding: '4px 0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {option.label}
                </div>
              )}
            />
            <Text size="sm" c="dimmed">
              , 1 - {Math.min(currentItemsPerPage, sortedData.length)} из {sortedData.length}
            </Text>
          </Group>
          <Pagination 
            total={Math.ceil(sortedData.length / currentItemsPerPage)} 
            value={currentPage} 
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
} 