export interface Team {
    id: string;
    team_name: string;
    team_image_id: string | null;
    team_image_name: string | null;
    team_image_path: string | null;
    member_ids: string[] | null;
    created_user_id: string | null;
    created_user_email: string | null;
    created_at: Date;
    updated_at: Date;
}
