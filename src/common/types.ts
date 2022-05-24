import type { Static, TSchema } from '@sinclair/typebox';
import { RouteGenericInterface } from 'fastify/types/route';

export type ResponseSchema<T extends Record<keyof T, TSchema>> = Static<
  T[keyof T]
>;

export type ObjectSchemaToType<T extends TSchema> = Static<T>;

export type HandlerGeneric<T extends RouteGenericInterface> = {
  [K in keyof T]: T[K];
};
