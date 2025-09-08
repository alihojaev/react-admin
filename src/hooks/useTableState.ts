import { useState, useEffect, useCallback } from 'react';

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
  value?: (item: any) => any;
}

interface TableState {
  searchQuery: string;
  filters: FilterModel[];
  itemsPerPage: number;
  columns: Column[];
  sortBy: string | null;
  reverseSortDirection: boolean;
}

const STORAGE_PREFIX = 'table_state_';

export function useTableState(pageId: string, initialColumns: Column[], availableFields: FieldInfo[]) {
  const storageKey = `${STORAGE_PREFIX}${pageId}`;

  // Функция для валидации фильтров
  const validateFilters = useCallback((filters: FilterModel[], availableFields: FieldInfo[]): FilterModel[] => {
    if (!availableFields.length) return [];
    
    const validFieldNames = new Set(availableFields.map(field => field.fieldName));
    
    return filters.filter(filter => {
      if (!filter.field) return false;
      return validFieldNames.has(filter.field.fieldName);
    });
  }, []);

  // Функция для валидации колонок
  const validateColumns = useCallback((columns: Column[], availableFields: FieldInfo[], initialColumns: Column[]): Column[] => {
    if (!availableFields.length) return initialColumns;
    
    const validFieldNames = new Set(availableFields.map(field => field.fieldName));
    
    // Фильтруем колонки, оставляя только те, которые есть в доступных полях
    const validColumns = columns.filter(column => {
      // Если это системная колонка (не из БД), оставляем
      if (initialColumns.some(initCol => initCol.key === column.key)) {
        return true;
      }
      // Если это поле из БД, проверяем его наличие
      return validFieldNames.has(column.key);
    });

    // Если все колонки были удалены, возвращаем начальные
    if (validColumns.length === 0) {
      return initialColumns;
    }

    return validColumns;
  }, []);

  // Загрузка состояния из localStorage
  const loadState = useCallback((): TableState => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        return {
          searchQuery: '',
          filters: [],
          itemsPerPage: 10,
          columns: initialColumns,
          sortBy: null,
          reverseSortDirection: false,
        };
      }

      const parsed = JSON.parse(saved);
      
      return {
        searchQuery: parsed.searchQuery || '',
        filters: parsed.filters || [],
        itemsPerPage: parsed.itemsPerPage || 10,
        columns: parsed.columns || initialColumns,
        sortBy: parsed.sortBy || null,
        reverseSortDirection: parsed.reverseSortDirection || false,
      };
    } catch (error) {
      console.error('Error loading table state:', error);
      return {
        searchQuery: '',
        filters: [],
        itemsPerPage: 10,
        columns: initialColumns,
        sortBy: null,
        reverseSortDirection: false,
      };
    }
  }, [storageKey, initialColumns]);

  // Функция для валидации состояния с учетом доступных полей
  const validateState = useCallback((state: TableState): TableState => {
    if (!availableFields.length) return state;
    
    const validFilters = validateFilters(state.filters, availableFields);
    const validColumns = validateColumns(state.columns, availableFields, initialColumns);
    
    return {
      ...state,
      filters: validFilters,
      columns: validColumns,
    };
  }, [availableFields, validateFilters, validateColumns, initialColumns]);

  // Сохранение состояния в localStorage
  const saveState = useCallback((state: Partial<TableState>) => {
    try {
      const current = loadState();
      const newState = { ...current, ...state };
      const validatedState = validateState(newState);
      localStorage.setItem(storageKey, JSON.stringify(validatedState));
    } catch (error) {
      console.error('Error saving table state:', error);
    }
  }, [storageKey, loadState, validateState]);

  // Состояние
  const [state, setState] = useState<TableState>(() => {
    const rawState = loadState();
    return validateState(rawState);
  });

  // Обновление состояния при изменении доступных полей
  useEffect(() => {
    if (availableFields.length > 0) {
      const rawState = loadState();
      const validatedState = validateState(rawState);
      setState(validatedState);
    }
  }, [availableFields.length, loadState, validateState]);

  // Функции для обновления состояния
  const updateSearchQuery = useCallback((searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery }));
    saveState({ searchQuery });
  }, [saveState]);

  const updateFilters = useCallback((filters: FilterModel[]) => {
    const validFilters = validateFilters(filters, availableFields);
    setState(prev => ({ ...prev, filters: validFilters }));
    saveState({ filters: validFilters });
  }, [validateFilters, availableFields, saveState]);

  const updateItemsPerPage = useCallback((itemsPerPage: number) => {
    setState(prev => ({ ...prev, itemsPerPage }));
    saveState({ itemsPerPage });
  }, [saveState]);

  const updateColumns = useCallback((columns: Column[]) => {
    const validColumns = validateColumns(columns, availableFields, initialColumns);
    setState(prev => ({ ...prev, columns: validColumns }));
    saveState({ columns: validColumns });
  }, [validateColumns, availableFields, initialColumns, saveState]);

  const updateSorting = useCallback((sortBy: string | null, reverseSortDirection: boolean) => {
    setState(prev => ({ ...prev, sortBy, reverseSortDirection }));
    saveState({ sortBy, reverseSortDirection });
  }, [saveState]);

  // Функция для сброса состояния
  const resetState = useCallback(() => {
    const defaultState = {
      searchQuery: '',
      filters: [],
      currentPage: 1,
      itemsPerPage: 10,
      columns: initialColumns,
      sortBy: null,
      reverseSortDirection: false,
    };
    setState(defaultState);
    localStorage.removeItem(storageKey);
  }, [storageKey, initialColumns]);

  return {
    state,
    updateSearchQuery,
    updateFilters,
    updateItemsPerPage,
    updateColumns,
    updateSorting,
    resetState,
  };
} 