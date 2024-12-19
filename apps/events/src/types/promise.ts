export interface PromiseCategory {
    id: number;
    name: string;
    description?: string;
    is_published: boolean;
}

export interface Promise {
    id: number;
    category_id: number;
    category_name: string;
    chapter: string;
    text: string;
    description?: string;
    resource_type?: 'image' | 'video' | 'audio';
    resource_url?: string;
    is_published: boolean;
    promise_category?: PromiseCategory;
}
