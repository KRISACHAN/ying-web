import type { LuckyNumberStatus } from '@/utils/constants';

// POST /api/v1/admin/lucky-number/create
export interface CreateLuckyNumberRequest {
    key: string;
    name: string;
    description: string;
    numbers: number[];
    participant_limit: number;
}

export interface CreateLuckyNumberResponse {
    message: string;
    activity_key: string;
}

// GET /api/v1/admin/lucky-number/query/:key
export interface LuckyNumber {
    drawn_number: number;
    username: string | null;
    drawn_at: string | null;
}

export interface QueryLuckyNumberResponse {
    id: number;
    name: string;
    activity_key: string;
    description: string;
    participant_limit: number;
    status: LuckyNumberStatus;
    participations: {
        drawn_number: number;
        username: string;
        drawn_at: string;
    }[];
    statistics: {
        total_participants: number;
        remaining_slots: number | null;
    };
    numbers: LuckyNumber[];
}

// DELETE /api/v1/admin/lucky-number/delete/:key
export interface DeleteLuckyNumberRequest {
    key: string;
}

export interface DeleteLuckyNumberResponse {
    message: string;
}

// GET /api/v1/admin/lucky-number/list
export interface LuckyNumberActivity {
    id: number;
    key: string;
    name: string;
    description: string;
    participant_limit: number;
    status: 'not_started' | 'ongoing' | 'ended';
    created_at: string;
    updated_at: string;
}

export type QueryLuckyNumberListResponse = LuckyNumberActivity[];

// PUT /api/v1/admin/lucky-number/cancel-participation
export interface CancelParticipationLuckyNumberRequest {
    key: string;
    username: string;
    drawn_number: number;
}

export interface CancelParticipationLuckyNumberResponse {
    message: string;
    username: string;
    drawn_number: number;
}
