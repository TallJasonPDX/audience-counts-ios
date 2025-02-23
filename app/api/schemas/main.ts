
export interface AudienceCreate {
    name: string;
    description?: string | null;
    filters: AudienceFilters;
}

export interface AudienceFilters {
    specialties: string[];
    states: string[];
    zip_regions: ZipRegion[];
    geo_logic: string;
}

export interface ZipRegion {
    label: string;
    zip: string;
    radius: number;
}

export interface MetaUserAudienceResponse {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    is_archived: boolean;
    sql_query: string | null;
    filters: AudienceFilters | null;
    user_id: number;
}

export interface MetaUserHCPAudienceResponse {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    is_archived: boolean;
    sql_query: string | null;
    filters: AudienceFilters | null;
    user_id: number;
}
