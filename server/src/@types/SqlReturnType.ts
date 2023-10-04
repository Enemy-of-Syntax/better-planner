import { PROJECT_STATUS } from '@prisma/client';

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

export interface Project {
    id: string;
    project_name: string;
    project_description: string;
    project_image_id: string | null;
    project_image_name: string | null;
    project_image_path: string | null;
    project_status: PROJECT_STATUS;
    board_ids: string[] | null;
    created_user_id: string;
    created_user_name: string | null;
    created_at: Date;
    updated_at: Date;
}
