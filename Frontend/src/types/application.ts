export interface Application {
    id: number;
    title: string;
    category: string;
    description: string;
    amount: number;
    status: string;
    submitted_at: string | null;
    created_at: string;

    owner: string;
}