export interface ExampleModel {
  id?: string;
  text: string;
  name: string;
  description: string;
  number: number;
  amount: number;
  date: string; // LocalDate в формате YYYY-MM-DD
  dateTime: string; // LocalDateTime в формате YYYY-MM-DDTHH:mm:ss
  time: string; // LocalTime в формате HH:mm:ss
}

export interface ExampleFieldInfo {
  fieldName: string;
  fieldType: string;
  description: string;
}

// Маппинг Java типов на TypeScript
export const JAVA_TO_TS_TYPES = {
  'String': 'string',
  'Long': 'number',
  'BigDecimal': 'number',
  'LocalDate': 'date',
  'LocalDateTime': 'datetime',
  'LocalTime': 'time',
} as const;

// Маппинг Java типов на HTML5 типы
export const JAVA_TO_HTML5_TYPES = {
  'String': 'text',
  'Long': 'number',
  'BigDecimal': 'number',
  'LocalDate': 'date',
  'LocalDateTime': 'datetime-local',
  'LocalTime': 'time',
} as const; 