import { request } from './client';

export interface Follower {
    id: string;
    userName: string;
    avatarUrl: string;
}

export interface FollowersPage {
    items: Follower[];
    total: number;
    page: number;
    hasMore: boolean;
}

export interface FollowStatus {
    following: boolean;
    followersCount: number;
    followingCount: number;
}

interface FollowerResponse {
    id: string;
    user_name: string;
    avatar_url?: string;
}

interface FollowersPageResponse {
    items: FollowerResponse[];
    total: number;
    page: number;
    hasMore: boolean;
}

interface FollowActionResponse {
    following: boolean;
    followersCount: number;
}

/** Ids de las cuentas que sigue el usuario actual. */
export function getFollowingIds(): Promise<string[]> {
    return request<string[]>('/follows/me/following-ids');
}

export function followUser(userId: string): Promise<FollowActionResponse> {
    return request<FollowActionResponse>(`/follows/${userId}`, undefined, 'POST');
}

export function unfollowUser(userId: string): Promise<FollowActionResponse> {
    return request<FollowActionResponse>(`/follows/${userId}`, undefined, 'DELETE');
}

export function getFollowStatus(userId: string): Promise<FollowStatus> {
    return request<FollowStatus>(`/follows/${userId}/status`);
}

export async function getFollowers(
    userId: string,
    page: number,
    limit: number,
): Promise<FollowersPage> {
    const data = await request<FollowersPageResponse>(
    `/follows/${userId}/followers?page=${page}&limit=${limit}`,
    );

    return {
    items: data.items.map((item) => ({
        id: item.id,
        userName: item.user_name,
        avatarUrl: item.avatar_url ?? '',
    })),
    total: data.total,
    page: data.page,
    hasMore: data.hasMore,
    };
}