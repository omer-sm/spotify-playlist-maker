import React from "react"
import { Spotify } from "react-spotify-embed";

export default function PlayerEmbed({songId}: {songId: string}) {
    return (
        <Spotify width="100%" link={`https://open.spotify.com/track/${songId}`} />
    )
}