// POST /api/v1/admin/lucky-number/create
export interface CreateLuckyNumberRequest {
    key: string;
    name: string;
    description: string;
    numbers: number[];
}

export interface CreateLuckyNumberResponse {
    message: string;
}

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
    created_at: string;
}

export type QueryLuckyNumberListResponse = LuckyNumberActivity[];
export interface Pagination {
    count: number;
    size: number;
    total: number;
}

// PUT /api/v1/admin/lucky-number/cancel-participation
export interface CancelParticipationLuckyNumberRequest {
    key: string;
    drawn_number: number;
    user_name: string;
}

export interface CancelParticipationLuckyNumberResponse {
    message: string;
}
