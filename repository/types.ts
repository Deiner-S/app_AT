export type ColumnDefinition = {
  type: string;
  primary?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  default?: string | number;
};