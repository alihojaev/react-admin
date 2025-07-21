import React, { useState, useEffect } from 'react';
import {
  Modal,
  Select,
  Radio,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
  Chip,
  ActionIcon,
} from '@mantine/core';

import { IconPlus, IconX } from '@tabler/icons-react';

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

interface FilterModalProps {
  opened: boolean;
  onClose: () => void;
  fields: FieldInfo[];
  onFiltersChange: (filters: FilterModel[]) => void;
  currentFilters: FilterModel[];
}

const stringRsql = [
  { value: "=like=", name: "Содержит" },
  { value: "=ilike=", name: "Не содержит" },
  { value: "=in=", name: "Входит" },
  { value: "=out=", name: "Не входит" },
];

const numberRsql = [
  { value: "==", name: "Равно" },
  { value: "!=", name: "Не равно" },
  { value: ">", name: "Больше" },
  { value: ">=", name: "Больше или равно" },
  { value: "<", name: "Меньше" },
  { value: "<=", name: "Меньше или равно" },
];

const dateRsql = [
  { value: "==", name: "Равно" },
  { value: "!=", name: "Не равно" },
  { value: ">", name: "Больше" },
  { value: ">=", name: "Больше или равно" },
  { value: "<", name: "Меньше" },
  { value: "<=", name: "Меньше или равно" },
  { value: "=in=", name: "Входит" },
  { value: "=out=", name: "Не входит" },
];

const rsqlVariants = [
  { value: "==", name: "Равно" },
  { value: "!=", name: "Не равно" },
  { value: ">", name: "Больше" },
  { value: ">=", name: "Больше или равно" },
  { value: "<", name: "Меньше" },
  { value: "<=", name: "Меньше или равно" },
  { value: "=in=", name: "Входит" },
  { value: "=out=", name: "Не входит" },
  { value: "=like=", name: "Содержит" },
  { value: "=ilike=", name: "Не содержит" },
];

export function FilterModal({ opened, onClose, fields, onFiltersChange, currentFilters }: FilterModalProps) {
  const [filterModel, setFilterModel] = useState<FilterModel>({});
  const [filters, setFilters] = useState<FilterModel[]>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const getFilteredRsqlVariants = () => {
    if (filterModel?.field?.fieldType) {
      const fieldType = filterModel.field.fieldType.toLowerCase();
      if (fieldType === 'string') return stringRsql;
      if (fieldType === 'long' || fieldType === 'bigdecimal' || fieldType === 'integer') return numberRsql;
      if (fieldType === 'localdate' || fieldType === 'localdatetime' || fieldType === 'localtime' || fieldType === 'date') return dateRsql;
    }
    return rsqlVariants;
  };

  const getValueInput = () => {
    if (!filterModel?.type) return null;

    const fieldType = filterModel.field?.fieldType?.toLowerCase();
    const isLike = filterModel.type.value === '=like=' || filterModel.type.value === '=ilike=';

    if (fieldType === 'string') {
      // Проверяем, является ли поле телефоном или email
      const fieldName = filterModel.field?.fieldName?.toLowerCase() || '';
      if (fieldName.includes('phone') || fieldName.includes('tel')) {
        return (
          <TextInput
            label="Значение"
            type="tel"
            placeholder="Введите номер телефона"
            value={filterModel.value || ''}
            onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
          />
        );
      }
      
      if (fieldName.includes('email')) {
        return (
          <TextInput
            label="Значение"
            type="email"
            placeholder="Введите email"
            value={filterModel.value || ''}
            onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
          />
        );
      }
      
      return (
        <TextInput
          label="Значение"
          placeholder="Введите значение"
          value={filterModel.value || ''}
          onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
        />
      );
    }

    if (fieldType === 'long' || fieldType === 'bigdecimal' || fieldType === 'integer') {
      // Проверяем, является ли поле ценой или денежной суммой
      const fieldName = filterModel.field?.fieldName?.toLowerCase() || '';
      if (fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('amount')) {
        return (
          <TextInput
            label="Значение"
            type="number"
            step="0.01"
            min="0"
            placeholder="Введите сумму (например: 1234.56)"
            value={filterModel.value || ''}
            onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
          />
        );
      }
      
      return (
        <NumberInput
          label="Значение"
          placeholder="Введите число"
          value={filterModel.value || ''}
          onChange={(value) => setFilterModel({ ...filterModel, value })}
        />
      );
    }

    if (fieldType === 'localdate') {
      return (
        <TextInput
          label="Значение"
          type="date"
          value={filterModel.value || ''}
          onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
        />
      );
    }

    if (fieldType === 'localdatetime') {
      return (
        <TextInput
          label="Значение"
          type="datetime-local"
          value={(() => {
            const value = filterModel.value;
            if (!value) return '';
            
            // Преобразуем значение в правильный формат для HTML5 input
            const dateTimeStr = String(value);
            // Если значение уже в формате YYYY-MM-DD HH:mm, преобразуем в YYYY-MM-DDTHH:mm
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateTimeStr)) {
              return dateTimeStr.replace(' ', 'T');
            }
            // Если значение в другом формате, пытаемся его исправить
            return dateTimeStr.replace(/[.\s,]/g, (match) => {
              if (match === '.') return '-';
              if (match === ',') return ' ';
              return match;
            }).replace(' ', 'T');
          })()}
          onChange={(e) => {
            const value = e.target.value;
            // Преобразуем формат даты и времени для API (заменяем T на пробел)
            const formattedValue = value ? value.replace('T', ' ') : value;
            setFilterModel({ ...filterModel, value: formattedValue });
          }}
        />
      );
    }

    if (fieldType === 'localtime') {
      return (
        <TextInput
          label="Значение"
          type="time"
          value={filterModel.value || ''}
          onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
        />
      );
    }

    return (
      <TextInput
        label="Значение"
        placeholder="Введите значение"
        value={filterModel.value || ''}
        onChange={(e) => setFilterModel({ ...filterModel, value: e.target.value })}
      />
    );
  };

  const addFilter = () => {
    if (filterModel.field && filterModel.type && filterModel.value !== undefined) {
      const newFilters = [...filters, filterModel];
      setFilters(newFilters);
      onFiltersChange(newFilters);
      setFilterModel({});
      onClose();
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getFilterDisplayText = (filter: FilterModel) => {
    if (!filter.field || !filter.type) return '';
    
    const fieldName = filter.field.description;
    const typeName = filter.type.name.toLowerCase();
    const value = filter.value;
    
    return `${fieldName} ${typeName} ${value}`;
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Добавить фильтр"
        size="md"
        centered
      >
        <Stack gap="md">
          <Select
            label="Поле"
            placeholder="Выберите поле"
            data={fields.map(field => ({ value: field.fieldName, label: field.description }))}
            value={filterModel.field?.fieldName || null}
            onChange={(value) => {
              const field = fields.find(f => f.fieldName === value);
              setFilterModel({ ...filterModel, field, type: undefined, value: undefined });
            }}
          />

          {filterModel.field && (
            <Radio.Group
              label="Оператор"
              value={filterModel.type?.value || ''}
              onChange={(value) => {
                const type = getFilteredRsqlVariants().find(t => t.value === value);
                setFilterModel({ ...filterModel, type, value: undefined });
              }}
            >
              <Group gap="xs">
                {getFilteredRsqlVariants().map((type) => (
                  <Radio key={type.value} value={type.value} label={type.name} />
                ))}
              </Group>
            </Radio.Group>
          )}

          {filterModel.type && getValueInput()}

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Отменить
            </Button>
            <Button onClick={addFilter} disabled={!filterModel.field || !filterModel.type || filterModel.value === undefined}>
              Добавить
            </Button>
          </Group>
        </Stack>
      </Modal>


    </>
  );
} 