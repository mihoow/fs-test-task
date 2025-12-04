import { z } from 'zod';
import type { IProductListOptions } from '../interfaces/product';

const FILTERS_QUERY_SCHEMA = {
  c: z.coerce.number().int().min(0),
  ec: z.enum(['A', 'B', 'C']),
  f: z.string(),
  s: z.enum(['price', 'capacity']),
  q: z.string(),
  p: z.coerce.number().int().min(1).default(1),
} as const;

const QUERY_KEY_TO_OPTION_KEY = new Map<
  keyof typeof FILTERS_QUERY_SCHEMA,
  keyof IProductListOptions
>([
  ['c', 'capacity'],
  ['ec', 'energyClass'],
  ['f', 'feature'],
  ['s', 'sort'],
  ['q', 'query'],
  ['p', 'page'],
]);

export function parseQueryToOptions(
  queryObj: Record<string, unknown>
): Partial<IProductListOptions> {
  const listOptions: Partial<IProductListOptions> = {};

  for (const [key, value] of Object.entries(queryObj)) {
    const queryKey =
      key in FILTERS_QUERY_SCHEMA ? (key as keyof typeof FILTERS_QUERY_SCHEMA) : null;
    if (!queryKey) continue;

    const schema = FILTERS_QUERY_SCHEMA[queryKey];
    const parsed = schema.safeParse(value);

    if (parsed.success && QUERY_KEY_TO_OPTION_KEY.has(queryKey)) {
      const optionKey = QUERY_KEY_TO_OPTION_KEY.get(queryKey)!;

      listOptions[optionKey] = parsed.data as never;
    }
  }

  return listOptions;
}
