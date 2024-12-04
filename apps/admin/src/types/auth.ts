export interface LoginParams {
    email: string;
    password: string;
}

export interface AdminInfo {
    id: number;
    username: string;
    email: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface AdminInfoResponse {
    admin: AdminInfo;
    roles: Role[];
    permissions: Permission[];
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    admin_info: AdminInfoResponse;
}

export interface RefreshTokenResponse {
    access_token: string;
}
