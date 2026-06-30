import { useEffect, useState } from "react";

import api from "../api/axios";

import type { Application } from "../types/application";

import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";

import ApplicationDialog from "../components/ApplicationDialog";

export default function ReviewQueue() {

    const [applications, setApplications] = useState<Application[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selected, setSelected] = useState<Application>();

    async function loadQueue() {

        try {

            const response = await api.get(
                "applications/review-queue/"
            );

            setApplications(response.data);

        } catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        loadQueue();

    }, []);

    return (

        <Container
            maxWidth="lg"
            sx={{ mt: 5 }}
        >

            <Typography
                variant="h4"
                gutterBottom
            >
                Review Queue
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Applications awaiting review.
            </Typography>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Applicant</TableCell>

                            <TableCell>Title</TableCell>

                            <TableCell>Status</TableCell>

                            <TableCell>Amount</TableCell>

                            <TableCell>Submitted</TableCell>

                            <TableCell>Action</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {applications.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                >

                                    No applications waiting for review.

                                </TableCell>

                            </TableRow>

                        ) : (

                            applications.map((app) => (

                                <TableRow
                                    key={app.id}
                                >

                                    <TableCell>

                                        {app.owner}

                                    </TableCell>

                                    <TableCell>

                                        {app.title}

                                    </TableCell>

                                    <TableCell>

                                        {app.status}

                                    </TableCell>

                                    <TableCell>

                                        K {app.amount}

                                    </TableCell>

                                    <TableCell>

                                        {app.submitted_at
                                            ? new Date(
                                                  app.submitted_at
                                              ).toLocaleDateString()
                                            : "-"}

                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={async () => {

                                                try {

                                                    if (app.status === "SUBMITTED") {

                                                        await api.post(
                                                            `applications/${app.id}/start-review/`
                                                        );

                                                        app.status = "UNDER_REVIEW";
                                                    }

                                                    setSelected(app);

                                                    setDialogOpen(true);

                                                    loadQueue();

                                                } catch (error) {

                                                    console.error(error);

                                                }

                                            }}
                                        >

                                            Review

                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <ApplicationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                application={selected}
                reload={loadQueue}
                mode="reviewer"
            />

        </Container>

    );

}