import type { GarmentType } from '../types';
import { request } from './client';

interface GarmentTypeResponse {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageResponse {
  message: string;
}

function toGarmentType(data: GarmentTypeResponse): GarmentType {
  return {
    id: data._id,
    name: data.name,
  };
}

export async function getGarmentTypes(): Promise<GarmentType[]> {
  const data = await request<GarmentTypeResponse[]>('/garment-types');

  return data.map(toGarmentType);
}

export async function createGarmentType(name: string): Promise<GarmentType> {
  return toGarmentType(await request<GarmentTypeResponse>('/garment-types', { name }));
}

export async function updateGarmentType(id: string, name: string): Promise<GarmentType> {
  return toGarmentType(
    await request<GarmentTypeResponse>(`/garment-types/${id}`, { name }, 'PATCH'),
  );
}

export async function deleteGarmentType(id: string): Promise<void> {
  await request<MessageResponse>(`/garment-types/${id}`, undefined, 'DELETE');
}
