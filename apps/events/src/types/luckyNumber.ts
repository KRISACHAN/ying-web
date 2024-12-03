// GET /api/v1/admin/lucky-number/query/:key
export interface LuckyNumber {
    id: number;
    drawn_number: number;
    is_drawn: boolean;
    user_name: string | null;
}

export interface QueryLuckyNumberResponse {
    activity_key: string;
    name: string;
    description: string;
    participant_limit: number;
    statistics: {
        total_participants: number;
        remaining_slots: number | null;
    };
    numbers: Array<{
        drawn_number: number;
        user_name: string;
        drawn_at: string;
    }>;
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
