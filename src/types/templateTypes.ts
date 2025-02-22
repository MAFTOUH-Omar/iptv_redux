export interface Bouquet {
    id: number;
    parent_id: number;
    bouquet_name: string;
    type: string;
    category_id: number;
    is_adult: boolean;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: number;
    name: string;
    is_global: boolean;
    show_for_my_created: boolean;
    publish: boolean;
    package_id: number;
    created_by_id: number;
    created_at: string;
    updated_at: string;
    bouquets?: Bouquet[];
}

export interface TemplateState {
    items: Template[];
    selectedTemplate: Template | null;
    loading: boolean;
    error: string | null;
}