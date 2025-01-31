// GET /api/v1/option-draw/info/:key
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

// GET /api/v1/option-draw/query/:key
export interface OptionDraw {
    id: number;
    activity_id: number;
    username: string | null;
    drawn_option: string | null;
    created_at: string | null;
}

// POST /api/v1/option-draw/draw
export interface DrawOptionRequest {
    key: string;
    username: string;
}

export interface DrawOptionResponse {
    activity_id: number;
    activity_key: string;
    drawn_option: string;
    username: string;
    message: string;
}

// GET /api/v1/option-draw/list
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

export interface QueryOptionDrawResponse {
    list: OptionDraw[];
    pagination: {
        total: number;
        page: number;
        page_size: number;
    };
}
