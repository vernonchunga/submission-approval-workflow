export interface AuditLog {

    id: number;

    old_status: string;

    new_status: string;

    comment: string;

    performed_by: string;

    created_at: string;

}