import type { Static, TSchema } from '@sinclair/typebox';

export type ResponseSchema<T extends Record<keyof T, TSchema>> = Static<
  T[keyof T]
>;

export type ObjectSchemaToType<T extends TSchema> = Static<T>;
