import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";

import api from "../api/axios";

import type { AuditLog } from "../types/audit";

interface Props {
    open: boolean;
    onClose: () => void;
    applicationId?: number;
}

export default function HistoryDialog({
    open,
    onClose,
    applicationId,
}: Props) {

    const [history, setHistory] = useState<AuditLog[]>([]);

    useEffect(() => {

        if (!open || !applicationId) return;

        loadHistory();

    }, [open, applicationId]);

    async function loadHistory() {

        try {

            const response = await api.get(
                `applications/${applicationId}/history/`
            );

            setHistory(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                Audit History

            </DialogTitle>

            <DialogContent>

                {history.length === 0 ? (

                    <Typography>

                        No history available.

                    </Typography>

                ) : (

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>Date</TableCell>

                                <TableCell>User</TableCell>

                                <TableCell>From</TableCell>

                                <TableCell>To</TableCell>

                                <TableCell>Comment</TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {history.map(item => (

                                <TableRow key={item.id}>

                                    <TableCell>

                                        {new Date(
                                            item.created_at
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell>

                                        {item.performed_by}

                                    </TableCell>

                                    <TableCell>

                                        {item.old_status}

                                    </TableCell>

                                    <TableCell>

                                        {item.new_status}

                                    </TableCell>

                                    <TableCell>

                                        {item.comment || "-"}

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                )}

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>

                    Close

                </Button>

            </DialogActions>

        </Dialog>

    );

}