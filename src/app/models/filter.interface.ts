export interface BaseFilter {
    property: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    filterType: string;
    multiple?: boolean;
}

export interface SelectMultipleFilter extends BaseFilter {
    filterType: 'select-multiple';
    value: string | number | (string | number)[] | null;
    options: { value: string | number; label: string }[];
}

export interface SelectFilter extends BaseFilter {
    filterType: 'select';
    value: string | number | (string | number)[] | null;
    options: { value: string | number; label: string }[];
}

export interface MonthFilter extends BaseFilter {
    filterType: 'month';
    value: string | number | (string | number)[] | null;
    options: { value: string | number; label: string }[];
}

export interface TextFilter extends BaseFilter {
    filterType: 'text';
    value: string | null;
}

export interface NumberFilter extends BaseFilter {
    filterType: 'number';
    value: number | null;
}

export interface DateFilter extends BaseFilter {
    filterType: 'date';
    value: Date | string | null;
}

export interface DateRangeFilter extends BaseFilter {
    filterType: 'date-range';
    value: { start: Date | string | null; end: Date | string | null };
    options?: { start: Date | string | null; end: Date | string | null }; // optional copy
}

export interface CheckboxFilter extends BaseFilter {
    filterType: 'checkbox';
    value: boolean;
}

export interface RadioFilter extends BaseFilter {
    filterType: 'radio';
    value: string | number | null;
    options: { value: string | number; label: string }[];
}

export type FilterItem =
    | SelectMultipleFilter
    | SelectFilter
    | MonthFilter
    | TextFilter
    | NumberFilter
    | DateFilter
    | DateRangeFilter
    | CheckboxFilter
    | RadioFilter;
