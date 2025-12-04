import { ZodType, z } from 'zod';
import type { IProductListOptions } from '../interfaces/product';

const FILTERS_QUERY_SCHEMA: Record<string, { name: keyof IProductListOptions; schema: ZodType }> = {
  c: { name: 'capacity', schema: z.coerce.number().int().min(0) },
  ec: { name: 'energyClass', schema: z.enum(['A', 'B', 'C']) },
  f: { name: 'feature', schema: z.string() },
  s: { name: 'sort', schema: z.enum(['price', 'capacity']) },
  q: { name: 'query', schema: z.string() },
  p: { name: 'page', schema: z.coerce.number().int().min(1).default(1) },
} as const;

export function parseQueryToOptions(
  queryObj: Record<string, unknown>
): Partial<IProductListOptions> {
  const listOptions: Partial<IProductListOptions> = {};

  for (const [key, value] of Object.entries(queryObj)) {
    const queryKey =
      key in FILTERS_QUERY_SCHEMA ? (key as keyof typeof FILTERS_QUERY_SCHEMA) : null;

    if (!queryKey) {
      console.log(`Unknown products query key: ${key}`);
      continue;
    }

    const { name, schema } = FILTERS_QUERY_SCHEMA[queryKey]!;
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      console.log(`Invalid products query value (${key}: ${value})`);
      continue;
    }

    listOptions[name] = parsed.data as never;
  }

  return listOptions;
}
