export interface CreateLuckyNumberRequest {
    key: string;
    numbers: number[];
}

export interface CreateLuckyNumberResponse {
    message: string;
}

export interface QueryLuckyNumberRequest {
    key: string;
}

export interface LuckyNumber {
    number: number;
    is_drawn: boolean;
    drawn_by: string | null;
}

export interface QueryLuckyNumberResponse {
    activityKey: string;
    numbers: LuckyNumber[];
}

export interface DeleteLuckyNumberRequest {
    key: string;
}

export interface DeleteLuckyNumberResponse {
    message: string;
}

export interface QueryLuckyNumberListRequest {
    page_num: number;
    page_size: number;
}

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
