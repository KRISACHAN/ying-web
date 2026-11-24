import type { LuckyNumberStatus } from '@/utils/constants';

// POST /v1/admin/lucky-number/create
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

// GET /v1/admin/lucky-number/query/:key
export interface LuckyNumber {
    id: number;
    has_number_data?: boolean;
    drawn_number: number;
    username: string | null;
    created_at: string | null;
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
        created_at: string;
    }[];
    statistics: {
        total_participants: number;
        remaining_slots: number | null;
    };
    numbers: LuckyNumber[];
}

// DELETE /v1/admin/lucky-number/delete/:key
export interface DeleteLuckyNumberRequest {
    key: string;
}

export interface DeleteLuckyNumberResponse {
    message: string;
}

// GET /v1/admin/lucky-number/list
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

// PUT /v1/admin/lucky-number/cancel-participation
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

export interface ActivityInfo {
    id: number;
    activity_key: string;
    name: string;
    description: string;
    participant_limit: number;
    status: LuckyNumberStatus;
    count: number;
}

export interface NumberDataColumn {
    id: string;
    label: string;
}

export interface ParticipationNumberData {
    drawn_number: number;
    username: string | null;
    columns: NumberDataColumn[];
    values: Record<string, string>;
    version: number;
}

export interface NumberDataIssue {
    sheet?: string;
    row?: number;
    column?: string;
    reason: string;
}

export type NumberDataImportMode = 'add' | 'update';

export interface NumberDataImportOptions {
    sheet?: string;
    number_column?: string;
    mode: NumberDataImportMode;
}

export interface NumberDataPreview {
    sheets: string[];
    sheet?: string;
    headers?: string[];
    number_column?: string;
    columns?: NumberDataColumn[];
    counts?: { added: number; existing: number; unchanged: number };
    samples?: Array<{
        row: number;
        drawn_number: number;
        values: Record<string, string>;
        status: 'added' | 'existing' | 'unchanged';
    }>;
}
