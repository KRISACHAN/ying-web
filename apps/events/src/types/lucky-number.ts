// GET /api/v1/admin/lucky-number/query/:key
export interface LuckyNumber {
    id: number;
    drawn_number: number;
    is_drawn: boolean;
    user_name: string | null;
}

export interface QueryLuckyNumberResponse {
    id: number;
    activity_key: string;
    name: string;
    description: string;
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
