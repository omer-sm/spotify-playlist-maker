import React from "react"
import Typography from "@mui/joy/Typography"
import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { authorizeUser } from "../spotifyManager"

export default function LogInPage() {
    return (
        <Stack justifyContent="flex-start" alignItems="center" spacing={4} height="100%">
            <Typography level="h2">Connect to Spotify to get started!</Typography>
            <Button onClick={authorizeUser} color="success">Connect to Spotify</Button>
        </Stack>
    )
}