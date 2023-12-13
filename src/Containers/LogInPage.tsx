import React from "react"
import Typography from "@mui/joy/Typography"
import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { authorizeUser } from "../spotifyManager"
import Divider from "@mui/joy/Divider"

export default function LogInPage() {
    return (
        <Stack justifyContent="flex-start" alignItems="center" spacing={4} height="100%">
            <Typography level="h2">Connect to Spotify to get started!</Typography>
            <Button onClick={authorizeUser} color="success">Connect to Spotify</Button>
            <Divider />
            <Typography level="h2">How does it work?</Typography>
            <Typography level="h3">🎶 1. Choose a song to base the playlist on 🎶</Typography>
            <Typography level="h3">🤔 2. Swipe right or left on the recommendations 🤔</Typography>
            <Typography level="h3">🎧 3. Click "Create playlist" 🎧</Typography>
            <Typography level="h3">😍 4. Enjoy your new playlist! 😍</Typography>
        </Stack>
    )
}