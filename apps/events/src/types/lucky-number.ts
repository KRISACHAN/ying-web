export interface QueryLuckyNumberRequest {
    key: string;
}

export interface LuckyNumber {
    number: number;
    is_drawn: boolean;
    drawn_by: string | null;
}

export interface QueryLuckyNumberResponse {
    activity_key: string;
    description: string;
    numbers: LuckyNumber[];
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

export interface DrawLuckyNumberRequest {
    key: string;
    user_name: string;
}

export interface DrawLuckyNumberResponse {
    drawn_number: number;
}
