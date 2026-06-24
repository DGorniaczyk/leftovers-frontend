import type { AxiosInstance } from "axios";
import httpClient from "./axios.ts";

export interface HttpService<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
> {
  getAll: () => Promise<T[]>;
  getById: (id: string | number) => Promise<T>;
  create: (payload: CreateDto) => Promise<T>;
  update: (id: string | number, payload: UpdateDto) => Promise<T>;
  remove: (id: string | number) => Promise<void>;
}

export function createHttpService<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
>(
  resource: string,
  client: AxiosInstance = httpClient,
): HttpService<T, CreateDto, UpdateDto> {
  return {
    getAll: async () => {
      const { data } = await client.get<T[]>(`/${resource}`);
      return data;
    },

    getById: async (id) => {
      const { data } = await client.get<T>(`/${resource}/${id}`);
      return data;
    },

    create: async (payload) => {
      const { data } = await client.post<T>(`/${resource}`, payload);
      return data;
    },

    update: async (id, payload) => {
      const { data } = await client.put<T>(`/${resource}/${id}`, payload);
      return data;
    },

    remove: async (id) => {
      await client.delete(`/${resource}/${id}`);
    },
  };
}
