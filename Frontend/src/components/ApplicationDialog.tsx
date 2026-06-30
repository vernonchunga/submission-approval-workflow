import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";

import api from "../api/axios";
import type { Application } from "../types/application";
import type { AuditLog } from "../types/audit";
import HistoryDialog from "./HistoryDialog";

import {

Divider,

Typography,

Table,

TableBody,

TableCell,

TableHead,

TableRow,

} from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    application?: Application;
    reload: () => void;
    mode?: "applicant" | "reviewer";
}

export default function ApplicationDialog({
    open,
    onClose,
    application,
    reload,
    mode = "applicant",
}: Props) {

    // ==========================================
    // Component State
    // ==========================================

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [history, setHistory] = useState<AuditLog[]>([]);
    const [historyOpen, setHistoryOpen] = useState(false);

    // ==========================================
    // Derived State
    // ==========================================

    const isEdit = Boolean(application);

    const isReviewer = mode === "reviewer";

    const isDraft =
    !application ||
    application.status === "DRAFT";

    const readOnly =
        isReviewer || !isDraft;

    console.log({
    mode,
    isReviewer,
    application,
    });

    const dialogTitle = isReviewer
        ? "Review Application"
        : !isEdit
            ? "New Application"
            : readOnly
                ? "Application Details"
                : "Edit Application";

    // ==========================================
    // Load application into form
    // ==========================================

    useEffect(() => {

            if (!application) {

                setTitle("");
                setCategory("");
                setDescription("");
                setAmount("");
                setHistory([]);

                return;

            }

            setTitle(application.title);
            setCategory(application.category);
            setDescription(application.description);
            setAmount(application.amount.toString());

            loadHistory();

        }, [application]);

    // ==========================================
    // Save Draft / Create
    // ==========================================

    const handleSave = async () => {

        const payload = {
            title,
            category,
            description,
            amount: Number(amount),
        };

        if (isEdit && application) {

            await api.patch(
                `applications/${application.id}/`,
                payload
            );

        } else {

            await api.post(
                "applications/",
                payload
            );

        }

        reload();
        onClose();

    };

    // ==========================================
    // Submit
    // ==========================================

    const handleSubmit = async () => {

        if (!application) return;

        await api.post(
            `applications/${application.id}/submit/`
        );

        reload();
        onClose();

    };

    // ==========================================
    // Reviewer Actions
    // ==========================================

    const handleApprove = async () => {

        if (!application) return;

        await api.post(
            `applications/${application.id}/approve/`
        );

        reload();
        onClose();

    };

    const handleReject = async () => {

        if (!application) return;

        const comment = prompt(
            "Reason for rejection"
        );

        if (!comment) return;

        await api.post(
            `applications/${application.id}/reject/`,
            { comment }
        );

        reload();
        onClose();

    };

    const handleReturn = async () => {

        if (!application) return;

        const comment = prompt(
            "Reason for return"
        );

        if (!comment) return;

        await api.post(
            `applications/${application.id}/return/`,
            { comment }
        );

        reload();
        onClose();

    };

    const loadHistory = async () => {

        if (!application) return;

        try {

            const response =
                await api.get(
                    `applications/${application.id}/history/`
                );

            setHistory(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                {dialogTitle}
            </DialogTitle>

            <DialogContent>

                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    disabled={readOnly}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    label="Category"
                    fullWidth
                    select
                    margin="normal"
                    value={category}
                    disabled={readOnly}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <MenuItem value="IT">
                        IT
                    </MenuItem>

                    <MenuItem value="Office">
                        Office
                    </MenuItem>

                    <MenuItem value="Finance">
                        Finance
                    </MenuItem>

                </TextField>

                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={description}
                    disabled={readOnly}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={amount}
                    disabled={readOnly}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                />

                <Divider sx={{ mt: 3, mb: 2 }} />

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        History
                    </Typography>

                    <Table size="small">

                        <TableHead>

                            <TableRow>

                                <TableCell>User</TableCell>

                                <TableCell>From</TableCell>

                                <TableCell>To</TableCell>

                                <TableCell>Comment</TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {history.map((item) => (

                                <TableRow
                                    key={item.id}
                                >

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

                                        {item.comment}

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Close
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => setHistoryOpen(true)}
                    disabled={!application}
                >
                    History
                </Button>

                {!isReviewer && !readOnly && (

                    <>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                        >
                            Save
                        </Button>

                        {isEdit && (

                            <Button
                                variant="outlined"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>

                        )}

                    </>

                )}

                {isReviewer && (

                    <>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>

                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleReject}
                        >
                            Reject
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleReturn}
                        >
                            Return
                        </Button>
                    </>

                )}

            </DialogActions>

            <HistoryDialog
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                applicationId={application?.id}
            />

        </Dialog>

    );

}