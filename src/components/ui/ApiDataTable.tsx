import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import cx from 'clsx';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconPlus, IconDots, IconEdit, IconTrash, IconFilter, IconSettings, IconX, IconDownload } from '@tabler/icons-react';
import { FilterModal } from './FilterModal';
import { useTableState } from '@/hooks/useTableState';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Menu,
  Pagination,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  LoadingOverlay,
  Modal,
  Checkbox,
  Stack,
  Divider,
  Select,
  Chip,
  Tooltip,
} from '@mantine/core';
import classes from './DataTable.module.css';
import { AuthApi } from '@/lib/generated/api';

interface RowData {
  id: string;
  [key: string]: any;
}

interface FieldInfo {
  fieldName: string;
  fieldType: string;
  description: string;
}

interface FilterModel {
  field?: FieldInfo;
  type?: { value: string; name: string };
  value?: any;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface ApiDataTableProps {
  columns: Column[];
  apiMethod: (query: string, page: number, size: number, sort: string) => Promise<any>;
  fieldsApiMethod?: () => Promise<any>;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  addButton?: {
    label?: string;
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
  onDataLoaded?: (data: any) => void;
  onFieldsLoaded?: (fields: any) => void;
  onColumnsChange?: (columns: Column[]) => void;
  onFiltersChange?: (filters: FilterModel[]) => void;
  pageId?: string; // Уникальный идентификатор страницы для сохранения состояния
  refreshTrigger?: number; // Триггер для обновления данных
  sortIndicatorColor?: string; // Цвет индикатора сортировки
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  align?: 'left' | 'center' | 'right';
  sortIndicatorColor?: string;
}

function Th({ children, reversed, sorted, onSort, align = 'left', sortIndicatorColor }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ textAlign: align }}>
      <div onClick={onSort} style={{ cursor: 'pointer' }}>
        <Group justify="space-between">
          <Group gap="xs" align="center">
            <Text fw={500} fz="sm">
              {children}
            </Text>
            {sorted && (
              <div 
                className={classes.sortIndicator} 
                style={sortIndicatorColor ? { backgroundColor: sortIndicatorColor } : undefined}
              />
            )}
          </Group>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </div>
    </Table.Th>
  );
}

export function ApiDataTable({
  columns: initialColumns,
  apiMethod,
  fieldsApiMethod,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  addButton,
  showSettingsButton = false,
  actions,
  searchPlaceholder = "Search by any field",
  emptyMessage = "Нет записей для отображения",
  className,
  onDataLoaded,
  onFieldsLoaded,
  onColumnsChange,
  onFiltersChange,
  pageId,
  refreshTrigger,
  sortIndicatorColor
}: ApiDataTableProps) {
  // Используем стандартный label для кнопки добавления
  const addButtonWithDefaultLabel = addButton ? {
    ...addButton,
    label: addButton.label || 'Добавить'
  } : undefined;
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [settingsModalOpened, setSettingsModalOpened] = useState(false);
  const [filterModalOpened, setFilterModalOpened] = useState(false);
  const [availableFields, setAvailableFields] = useState<FieldInfo[]>([]);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);
  
  // Используем ref для отслеживания состояния загрузки
  const fieldsLoadingRef = useRef(false);
  const dataLoadingRef = useRef(false);

  // Использование хука для сохранения состояния
  const {
    state,
    updateSearchQuery,
    updateFilters,
    updateItemsPerPage,
    updateColumns,
    updateSorting,
  } = useTableState(pageId || 'default', initialColumns, availableFields);

  const {
    searchQuery,
    filters,
    itemsPerPage: currentItemsPerPage,
    columns,
    sortBy,
    reverseSortDirection,
  } = state;

  // Локальное состояние для текущей страницы (не сохраняется)
  const [currentPage, setCurrentPage] = useState(1);

  const handleSettingsClick = () => {
    setSettingsModalOpened(true);
  };

  const handleFilterClick = () => {
    setFilterModalOpened(true);
  };

  const handleFiltersChange = (newFilters: FilterModel[]) => {
    updateFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const getFilterDisplayText = (filter: FilterModel) => {
    if (!filter.field || !filter.type) return '';
    
    const fieldName = filter.field.description;
    const typeName = filter.type.name.toLowerCase();
    const value = filter.value;
    
    return { fieldName, typeName, value };
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    updateFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleColumnToggle = (fieldName: string, checked: boolean) => {
    if (checked) {
      // Добавляем колонку
      const field = availableFields.find(f => f.fieldName === fieldName);
      if (field) {
        const newColumn: Column = {
          key: field.fieldName,
          label: field.description,
          sortable: true,
        };
        const newColumns = [...columns, newColumn];
        updateColumns(newColumns);
        if (onColumnsChange) {
          onColumnsChange(newColumns);
        }
      }
    } else {
      // Удаляем колонку
      const newColumns = columns.filter(col => col.key !== fieldName);
      updateColumns(newColumns);
      if (onColumnsChange) {
        onColumnsChange(newColumns);
      }
    }
  };

  const loadFields = useCallback(async () => {
    if (fieldsApiMethod && !fieldsLoaded && !fieldsLoadingRef.current) {
      fieldsLoadingRef.current = true;
      try {
        const fields = await fieldsApiMethod();
        setAvailableFields(fields);
        setFieldsLoaded(true);
        if (onFieldsLoaded) {
          onFieldsLoaded(fields);
        }
      } catch (error) {
        console.error('Error loading fields:', error);
      } finally {
        fieldsLoadingRef.current = false;
      }
    }
  }, [fieldsApiMethod, onFieldsLoaded, fieldsLoaded]);

  const loadData = useCallback(async () => {
    // Не загружаем данные, если поля еще не загружены или уже загружаем
    if (availableFields.length === 0 || !fieldsLoaded || dataLoadingRef.current) {
      return;
    }
    
    dataLoadingRef.current = true;
    
    setLoading(true);
    try {
      // Формируем параметры для API
      const page = currentPage - 1; // API ожидает страницы с 0
      const size = currentItemsPerPage;
      
      // Формируем RSQL запрос из фильтров и поиска
      let query = '';
      
      // Добавляем поиск по текстовым полям
      if (searchQuery) {
        const searchFields = availableFields.filter(field => 
          field.fieldType.toLowerCase() === 'string'
        );
        if (searchFields.length > 0) {
          const searchExpressions = searchFields.map(field => 
            `${field.fieldName}=like=*${searchQuery}*`
          );
          query = searchExpressions.join(',');
        }
      }
      
      // Добавляем фильтры
      if (filters.length > 0) {
        const filterExpressions = filters.map(filter => {
          if (!filter.field || !filter.type || filter.value === undefined) return '';
          
          const fieldName = filter.field.fieldName;
          const operator = filter.type.value;
          let value = filter.value;
          
          // Обработка специальных операторов
          if (operator === '=like=' || operator === '=ilike=') {
            value = `*${value}*`;
          }
          
          return `${fieldName}${operator}${value}`;
        }).filter(expr => expr !== '');
        
        if (filterExpressions.length > 0) {
          const filterQuery = filterExpressions.join(';');
          query = query ? `${query};${filterQuery}` : filterQuery;
        }
      }
      
      // Формируем сортировку
      let sort = 'cdt,desc'; // По умолчанию сортировка по дате создания
      if (sortBy) {
        const direction = reverseSortDirection ? 'desc' : 'asc';
        sort = `${sortBy},${direction}`;
      }

      const response = await apiMethod(query, page, size, sort);
      
      // Предполагаем, что API возвращает объект с data и total
      // Если структура ответа другая, нужно будет адаптировать
      const responseData = response.data || response.content || response;
      const responseTotal = response.total || response.totalElements || responseData.length;
      
      setData(responseData);
      setTotalItems(responseTotal);
      setTotalPages(Math.ceil(responseTotal / size));
      
      if (onDataLoaded) {
        onDataLoaded(response);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      dataLoadingRef.current = false;
    }
  }, [apiMethod, searchQuery, currentPage, currentItemsPerPage, sortBy, reverseSortDirection, filters, availableFields, fieldsLoaded, onDataLoaded]);

  // Загружаем поля при монтировании компонента
  useLayoutEffect(() => {
    if (fieldsApiMethod && !fieldsLoaded && !fieldsLoadingRef.current) {
      loadFields();
    }
  }, [fieldsApiMethod, fieldsLoaded]); // Убираем loadFields из зависимостей

  // Загружаем данные при изменении параметров
  useEffect(() => {
    if (availableFields.length > 0 && fieldsLoaded && !dataLoadingRef.current) {
      loadData();
    }
  }, [searchQuery, currentPage, currentItemsPerPage, sortBy, reverseSortDirection, filters, availableFields.length, fieldsLoaded, loadData]);

  // Обновляем данные при изменении refreshTrigger
  useEffect(() => {
    if (refreshTrigger && availableFields.length > 0 && fieldsLoaded && !dataLoadingRef.current) {
      loadData();
    }
  }, [refreshTrigger, availableFields.length, fieldsLoaded, loadData]);

  const setSorting = (field: string) => {
    if (field === sortBy) {
      if (reverseSortDirection) {
        // Если уже desc, убираем сортировку
        updateSorting(null, false);
      } else {
        // Если asc, переключаем на desc
        updateSorting(field, true);
      }
    } else {
      // Если новое поле, начинаем с asc
      updateSorting(field, false);
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении сортировки
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleSearch = () => {
    updateSearchQuery(search);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string | null) => {
    if (value) {
      const newItemsPerPage = parseInt(value);
      updateItemsPerPage(newItemsPerPage);
    }
  };

  const rows = data.map((row) => (
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

  // --- CSV Download Logic ---
  const handleDownloadCsv = async () => {
    // Определяем entityName по pageId (пример для example-page)
    let entityName = '';
    let downloadReport: ((body: any) => Promise<any>) | null = null;
    if (pageId === 'example-page') {
      entityName = 'ExampleDictEntity';
      const authApi = new AuthApi();
      downloadReport = authApi.example.downloadReport;
    } else {
      // TODO: добавить другие сопоставления pageId -> entityName и метод
      alert('Скачивание CSV для этой таблицы не реализовано');
      return;
    }

    // Собираем поля и заголовки
    const fields = columns.map(col => col.key);
    const headers: Record<string, string> = {};
    columns.forEach(col => {
      headers[col.key] = col.label;
    });

    // Собираем фильтры в RSQL
    let rsqlFilter = '';
    if (filters.length > 0) {
      const filterExpressions = filters.map(filter => {
        if (!filter.field || !filter.type || filter.value === undefined) return '';
        const fieldName = filter.field.fieldName;
        const operator = filter.type.value;
        let value = filter.value;
        if (operator === '=like=' || operator === '=ilike=') {
          value = `*${value}*`;
        }
        return `${fieldName}${operator}${value}`;
      }).filter(Boolean);
      if (filterExpressions.length > 0) {
        rsqlFilter = filterExpressions.join(';');
      }
    }

    const body = {
      entityName,
      fields,
      headers,
      ...(rsqlFilter ? { rsqlFilter } : {})
    };

    try {
      // Используем downloadReport из AuthApi
      const response = await downloadReport!(body);
      let csvText: string | undefined = undefined;
      if (typeof response === 'string') {
        csvText = response;
      } else if (response && typeof response.data === 'string') {
        csvText = response.data;
      } else if (response && response.data instanceof Blob) {
        csvText = await response.data.text();
      }
      if (!csvText) {
        alert('Ошибка: не удалось получить CSV из ответа');
        return;
      }
      const blob = new Blob([csvText], { type: 'text/csv' });
      blob.text(); // можно убрать, если не нужно
      // Получаем имя файла из Content-Disposition
      let fileName = 'report.csv';
      const disposition = response.headers && response.headers['content-disposition'];
      if (disposition) {
        const match = disposition.match(/filename=\"(.+?)\"/);
        if (match) fileName = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Ошибка скачивания отчёта: ' + (e as Error).message);
    }
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      
      {searchable && (
        <Group mb="md" gap="xs">
          <TextInput
            placeholder={searchPlaceholder}
            style={{ flex: 1 }}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          <ActionIcon variant="light" size="lg" onClick={handleFilterClick}>
            <IconFilter size={18} />
          </ActionIcon>
          <ActionIcon variant="light" size="lg" onClick={handleSearch}>
            <IconSearch size={18} />
          </ActionIcon>
        </Group>
      )}

      {/* Отображение активных фильтров */}
      {filters.length > 0 && (
        <Group gap="xs" mt="md" mb="md">
          {filters.map((filter, index) => (
            <div
              key={index}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                border: '1px solid var(--mantine-color-gray-4)',
                borderRadius: 'var(--mantine-radius-sm)',
                backgroundColor: 'var(--mantine-color-white)',
                fontSize: 'var(--mantine-font-size-sm)',
                color: 'var(--mantine-color-gray-7)',
              }}
            >
              <span>
                {(() => {
                  const filterText = getFilterDisplayText(filter);
                  if (typeof filterText === 'string') {
                    return filterText;
                  }
                  return (
                    <>
                      <span>{filterText.fieldName}</span>
                      <span style={{ color: 'var(--mantine-color-gray-5)', marginLeft: '4px', marginRight: '4px' }}>
                        {filterText.typeName}
                      </span>
                      <span>{filterText.value}</span>
                    </>
                  );
                })()}
              </span>
              <ActionIcon
                size="xs"
                variant="transparent"
                color="gray"
                onClick={() => removeFilter(index)}
                style={{ marginTop: '2px' }}
              >
                <IconX size={16} />
              </ActionIcon>
            </div>
          ))}
        </Group>
      )}
      
      <div style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-sm)' }}>
        <ScrollArea 
          h={Math.max(data.length * 50 + 40, 100)} 
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
                      sortIndicatorColor={sortIndicatorColor}
                    >
                      {column.label}
                    </Th>
                  ) : (
                    <Table.Th key={column.key} style={{ textAlign: column.align || 'left', width: column.width }}>
                      {column.label}
                    </Table.Th>
                  )
                ))}
                {(addButtonWithDefaultLabel || showSettingsButton) && (
                  <Table.Th style={{ textAlign: 'end', width: showSettingsButton ? 200 : 133 }}>
                    <Group gap="xs" justify="flex-end">
                      {/* Кнопка скачать CSV */}
                      <Tooltip label="Скачать CSV" withArrow>
                        <ActionIcon 
                          variant="light" 
                          size="md"
                          onClick={handleDownloadCsv}
                        >
                          <IconDownload size={20} />
                        </ActionIcon>
                      </Tooltip>
                      {showSettingsButton && (
                        <ActionIcon 
                          variant="light" 
                          size="md"
                          onClick={handleSettingsClick}
                        >
                          <IconSettings size={20} />
                        </ActionIcon>
                      )}
                      {addButtonWithDefaultLabel && (
                        <Button 
                          size="xs" 
                          onClick={addButtonWithDefaultLabel.onClick}
                        >
                          {addButtonWithDefaultLabel.label}
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
                  <Table.Td colSpan={columns.length + (addButtonWithDefaultLabel ? 1 : 0)}>
                    <Text fw={500} ta="center">
                      {loading ? 'Загрузка...' : emptyMessage}
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
                <div {...others} style={{ padding: '4px 0', textAlign: 'center' }}>
                  {option.label}
                </div>
              )}
            />
            <Text size="sm" c="dimmed">
              , {((currentPage - 1) * currentItemsPerPage) + 1} - {Math.min(currentPage * currentItemsPerPage, totalItems)} из {totalItems}
            </Text>
          </Group>
          <Pagination 
            total={totalPages} 
            value={currentPage} 
            onChange={handlePageChange}
            disabled={loading}
          />
        </div>
      )}

      {/* Модальное окно настроек */}
      <Modal
        opened={settingsModalOpened}
        onClose={() => setSettingsModalOpened(false)}
        title="Настройки таблицы"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Выберите поля для отображения в таблице:
          </Text>
          
          <Divider />
          
          {availableFields.map((field) => {
            const isSelected = columns.some(col => col.key === field.fieldName);
            return (
              <Checkbox
                key={field.fieldName}
                label={
                  <div>
                    <Text size="sm" fw={500}>{field.description}</Text>
                    <Text size="xs" c="dimmed">{field.fieldName} ({field.fieldType})</Text>
                  </div>
                }
                checked={isSelected}
                onChange={(event) => handleColumnToggle(field.fieldName, event.currentTarget.checked)}
              />
            );
          })}
          
          <Divider />
          
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setSettingsModalOpened(false)}>
              Закрыть
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Модальное окно фильтров */}
      <FilterModal
        opened={filterModalOpened}
        onClose={() => setFilterModalOpened(false)}
        fields={availableFields}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />
    </div>
  );
} 