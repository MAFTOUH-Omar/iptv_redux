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

export interface Package {
    id: number;
    name: string;
    is_trial: boolean;
    is_paid_trial: boolean;
    can_enable_vpn: boolean;
    credit: number;
    period: number;
    period_type: string;
    max_connections: number;
    created_at: string;
    updated_at: string;
    bouquets?: Bouquet[];
}

export interface PackageState {
    items: Package[];
    selectedPackage: Package | null;
    loading: boolean;
    error: string | null;
}