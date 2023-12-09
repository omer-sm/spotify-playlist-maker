import React from "react"
import Stack from "@mui/joy/Stack"
import PlayerEmbed from '../Components/PlayerEmbed'
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded'
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded'
import IconButton from "@mui/joy/IconButton"
import Tooltip from "@mui/joy/Tooltip"
import { nextSong, likeSong } from "../spotifyManager"

export default function SongChoosingPage({ songId, setSongId }: { songId: string, setSongId: Function }) {
    return (
        <Stack>
            <PlayerEmbed songId={songId} />
            <Stack direction="row" justifyContent="space-around" >
                <IconButton variant="soft" sx={{ width: "30%", height: "4rem" }}
                onClick={() => { setSongId(nextSong()) }}>
                    <ThumbDownAltRoundedIcon sx={{ height: "80%", width: "80%" }} />
                </IconButton>
                <IconButton variant="soft" sx={{ width: "30%", height: "4rem" }}
                 onClick={() => { likeSong(songId); setSongId(nextSong()) }}>
                    <ThumbUpAltRoundedIcon sx={{ height: "80%", width: "80%" }} />
                </IconButton>
            </Stack>
        </Stack>
    )
}