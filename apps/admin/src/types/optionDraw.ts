// POST /api/v1/admin/option-draw/create
export interface CreateOptionDrawRequest {
    key: string;
    name: string;
    description: string;
    options: string[];
    participant_limit?: number;
    allow_duplicate_options?: boolean;
}

export interface CreateOptionDrawResponse {
    message: string;
    activity_key: string;
}

// GET /api/v1/admin/option-draw/query/:key
export interface OptionDraw {
    id: number;
    activity_id: number;
    username: string | null;
    drawn_option: string | null;
    created_at: string | null;
}

export interface QueryOptionDrawResponse {
    id: number;
    name: string;
    activity_key: string;
    description: string;
    participant_limit: number;
    status: string;
    participations: {
        drawn_option: string;
        username: string;
        created_at: string;
    }[];
    statistics: {
        total_participants: number;
        remaining_slots: number | null;
    };
    options: OptionDraw[];
}

// DELETE /api/v1/admin/option-draw/delete/:key
export interface DeleteOptionDrawRequest {
    key: string;
}

export interface DeleteOptionDrawResponse {
    message: string;
}

// GET /api/v1/admin/option-draw/list
export interface OptionDrawActivity {
    id: number;
    key: string;
    name: string;
    description: string;
    participant_limit: number;
    allow_duplicate_options: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export type QueryOptionDrawListResponse = OptionDrawActivity[];

// PUT /api/v1/admin/option-draw/cancel-participation
export interface CancelParticipationOptionDrawRequest {
    key: string;
    username: string;
}

export interface CancelParticipationOptionDrawResponse {
    message: string;
    username: string;
    drawn_option: string;
}

// GET /api/v1/admin/option-draw/info/:key
export interface ActivityInfo {
    id: number;
    activity_key: string;
    name: string;
    description: string;
    participant_limit: number;
    allow_duplicate_options: boolean;
    status: string;
    count: number;
    options: string[];
}
