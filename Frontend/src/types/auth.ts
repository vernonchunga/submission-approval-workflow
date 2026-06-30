export interface User {
    id: number;
    username: string;
    role: "APPLICANT" | "REVIEWER";
}

export interface LoginResponse {
    access: string;
    refresh: string;
}