import { ZodType, z } from 'zod';
import type { IProductListOptions } from '@app/shared/interfaces';
import { ProductListOptions } from '@app/shared/products';

const FILTERS_QUERY_SCHEMA: Record<keyof IProductListOptions, ZodType> = {
  capacity: z.coerce.number().int().min(1),
  energyClass: z.enum(['A', 'B', 'C']),
  feature: z.string().min(1),
  sort: z.enum(['price', 'capacity']),
  query: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
} as const;

export function parseQueryToOptions(
  queryObj: Record<string, unknown>
): Partial<IProductListOptions> {
  const parsedQuery = ProductListOptions.fromQuery(queryObj);
  const listOptions: Partial<IProductListOptions> = {};

  for (const [key, value] of Object.entries(parsedQuery)) {
    const optionKey = key as keyof IProductListOptions;

    const schema = FILTERS_QUERY_SCHEMA[optionKey]!;
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      if (value) {
        console.log(`Invalid products query value (${key}: ${value})`);
      }

      continue;
    }

    listOptions[optionKey] = parsed.data as never;
  }

  return listOptions;
}
