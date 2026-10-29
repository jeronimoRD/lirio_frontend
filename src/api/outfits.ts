import type { GarmentType, Outfit } from '../types';
import { request } from './client';

interface OutfitItemResponse {
  post_id: string;
  garment_type: GarmentType;
  title: string | null;
  image: string | null;
  is_available: boolean;
}

interface OutfitResponse {
  _id: string;
  name: string;
  user_id: string;
  is_public: boolean;
  is_available: boolean;
  category_ids: string[];
  items: OutfitItemResponse[];
  createdAt?: string;
}

function toOutfit(data: OutfitResponse): Outfit {
  return {
    id: data._id,
    name: data.name,
    userId: data.user_id,
    isPublic: data.is_public,
    isAvailable: data.is_available,
    categoryIds: data.category_ids ?? [],
    createdAt: data.createdAt,
    items: data.items.map((item) => ({
      postId: item.post_id,
      garmentType: item.garment_type,
      title: item.title,
      image: item.image,
      isAvailable: item.is_available,
    })),
  };
}

export async function getMyOutfits(): Promise<Outfit[]> {
  const data = await request<OutfitResponse[]>('/outfits/my');

  return data.map(toOutfit);
}

export async function getPublicOutfits(): Promise<Outfit[]> {
  const data = await request<OutfitResponse[]>('/outfits/public');

  return data.map(toOutfit);
}

export async function getOutfit(id: string): Promise<Outfit> {
  const data = await request<OutfitResponse>(`/outfits/${id}`);

  return toOutfit(data);
}

export async function deleteOutfit(id: string): Promise<void> {
  await request(`/outfits/${id}`, undefined, 'DELETE');
}

export interface OutfitInput {
  name: string;
  isPublic: boolean;
  postIds: string[];
}

function toOutfitBody(input: OutfitInput) {
  return {
    name: input.name,
    is_public: input.isPublic,
    items: input.postIds.map((post_id) => ({ post_id })),
  };
}

export async function createOutfit(input: OutfitInput): Promise<Outfit> {
  const data = await request<{ message: string; outfit: OutfitResponse }>(
    '/outfits',
    toOutfitBody(input),
  );

  return toOutfit(data.outfit);
}

export async function updateOutfit(id: string, input: OutfitInput): Promise<Outfit> {
  const data = await request<{ message: string; outfit: OutfitResponse }>(
    `/outfits/${id}`,
    toOutfitBody(input),
    'PATCH',
  );

  return toOutfit(data.outfit);
}
