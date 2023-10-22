import { INVITATION_STATUS, MEMBER_STATUS, PROJECT_STATUS, USER_ROLE } from '@prisma/client';

export interface User {
    id: string;
    email: string;
    password: string;
    status: null | INVITATION_STATUS;
    role: null | USER_ROLE;
    image_id: null | string;
    image_name: null | string;
    image_path: null | string;
    created_at: Date;
    updated_at: Date;
}
export interface Team {
    id: string;
    team_name: string;
    team_image_id: string | null;
    team_image_name: string | null;
    team_image_path: string | null;
    members: Member[];
    created_user_id: string | null;
    created_user_email: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Member {
    created_at: Date;
    created_user_name: null | string;
    id: string;
    member_email: string;
    member_status: MEMBER_STATUS;
    member_team_id: string;
    member_team_name: string;
    updated_at: Date;
    user_id: string;
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
