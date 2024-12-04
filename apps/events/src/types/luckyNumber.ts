import type { LuckyNumberStatus } from '@/utils/constants';

// GET /api/v1/admin/lucky-number/query/:key
export interface LuckyNumber {
    id: number;
    drawn_number: number;
    user_name: string | null;
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
        user_name: string;
        drawn_at: string;
    }[];
    statistics: {
        total_participants: number;
        remaining_slots: number | null;
    };
    numbers: LuckyNumber[];
}

// GET /api/v1/admin/lucky-number/list
export interface LuckyNumberActivity {
    id: number;
    key: string;
    created_at: string;
}

export type QueryLuckyNumberListResponse = LuckyNumberActivity[];

// POST /api/v1/admin/lucky-number/draw
export interface DrawLuckyNumberRequest {
    key: string;
    user_name: string;
}

export interface DrawLuckyNumberResponse {
    drawn_number: number;
}
