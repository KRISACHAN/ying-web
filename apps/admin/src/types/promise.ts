export interface PromiseCategory {
    id: number;
    name: string;
    description: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface PromiseItem {
    id: number;
    category_id: number;
    category_name: string;
    chapter: string;
    text: string;
    description: string;
    resource_type: 'image' | 'video' | 'audio';
    resource_url: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    promise_category?: PromiseCategory;
}
