import React from "react"
import Stack from "@mui/joy/Stack"
import PlayerEmbed from '../Components/PlayerEmbed'
import SwipeArea from "../Components/SwipeArea"
import { addLikedSongsToPlaylist } from "../spotifyManager"
import Button from "@mui/joy/Button"
import Typography from "@mui/joy/Typography"
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import Tooltip from "@mui/joy/Tooltip"

export default function SongChoosingPage({ songId, setSongId, setStage }: { songId: string, setSongId: Function, setStage: Function }) {
    const [showPlaylistCreatedTooltip, setShowPlaylistCreatedTooltip] = React.useState(false)
    return (
        <Stack spacing={2}>
            <PlayerEmbed songId={songId} />
            <SwipeArea songId={songId} setSongId={setSongId} />
            <Stack direction="row" spacing={4} justifyContent="center">
                <Button onClick={()=>{
                    setSongId("")
                    setStage(1)
                    }} color="warning">
                    <ReplayRoundedIcon />
                    <Typography ml={0.3}>Choose another song</Typography>
                </Button>
                <Tooltip title="Playlist created! Check your spotify 🔥" open={showPlaylistCreatedTooltip}>
                <Button onClick={() => { addLikedSongsToPlaylist().then(r => {
                    if (r){
                        setShowPlaylistCreatedTooltip(true)
                        setTimeout(()=>{setShowPlaylistCreatedTooltip(false)}, 2000)
                    }
                }) }} color="success">
                    <AddCircleOutlineRoundedIcon />
                    <Typography ml={0.3}>Create playlist!</Typography>
                </Button>
                </Tooltip>
            </Stack>
        </Stack>
    )
}