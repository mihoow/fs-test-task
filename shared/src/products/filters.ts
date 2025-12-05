import { IProductListOptions } from '../interfaces';

type ProductListOptionsInput = {
  [K in keyof IProductListOptions]: IProductListOptions[K] | '';
};

const QUERY_KEY_MAP: Record<keyof IProductListOptions, string> = {
  capacity: 'c',
  energyClass: 'ec',
  feature: 'f',
  query: 'q',
  sort: 's',
  page: 'p',
} as const;

const REVERSE_QUERY_KEY_MAP = Object.entries(QUERY_KEY_MAP).reduce<
  Record<string, keyof IProductListOptions>
>((acc, [optionKey, shortKey]) => {
  acc[shortKey] = optionKey as keyof IProductListOptions;
  return acc;
}, {});

export class ProductListOptions {
  constructor(private options: Partial<IProductListOptions>) {}

  static toQueryString(options: Partial<ProductListOptionsInput>): string {
    const queryObj: Record<string, string> = {};

    for (const [key, value] of Object.entries(options)) {
      queryObj[QUERY_KEY_MAP[key as keyof IProductListOptions]] = String(value);
    }

    return new URLSearchParams(queryObj).toString();
  }

  static fromQuery(
    query: Record<string, unknown>
  ): Partial<Record<keyof IProductListOptions, unknown>> {
    const result: Partial<Record<keyof IProductListOptions, unknown>> = {};

    for (const [key, value] of Object.entries(query)) {
      const queryKey =
        key in REVERSE_QUERY_KEY_MAP ? (key as keyof typeof REVERSE_QUERY_KEY_MAP) : null;

      if (!queryKey) {
        console.log(`Unknown products query key: ${key}`);
        continue;
      }

      result[REVERSE_QUERY_KEY_MAP[key]] = value;
    }

    return result;
  }
}
