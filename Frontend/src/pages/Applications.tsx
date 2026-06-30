import { useEffect, useState } from "react";

import ApplicationDialog from "../components/ApplicationDialog";

import api from "../api/axios";

import type { Application } from "../types/application";

import {

    Container,

    Typography,

    Button,

    Paper,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Card,

    CardContent,

    Grid,

} from "@mui/material";

export default function Applications() {

    const [applications, setApplications] = useState<Application[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [selected, setSelected] =
    useState<Application>();

    async function loadApplications() {

        try {

            const response = await api.get("applications/");

            setApplications(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        loadApplications();

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

                My Applications

            </Typography>

            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Grid size={{ xs: 12, md: 4 }}>

                    <Card>

                        <CardContent>

                            <Typography>

                                Total Applications

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {applications.length}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            <Button
                    variant="contained"
                    sx={{ mb: 3 }}
                    onClick={() => {

                    setSelected(undefined);

                    setDialogOpen(true);

                    }}
                    >

                    New Application

            </Button>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Title

                            </TableCell>

                            <TableCell>

                                Status

                            </TableCell>

                            <TableCell>

                                Amount

                            </TableCell>

                            <TableCell>

                                Actions

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {applications.map((app) => (

                            <TableRow
                                key={app.id}
                            >

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

                                    <Button

                                            onClick={()=>{

                                            setSelected(app);

                                            setDialogOpen(true);

                                            }}

                                            >

                                            View

                                            </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            <ApplicationDialog

                    open={dialogOpen}

                    onClose={()=>setDialogOpen(false)}

                    application={selected}

                    reload={loadApplications}

                    />

        </Container>

    );

}