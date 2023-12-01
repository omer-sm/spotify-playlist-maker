import React from "react"
import { Spotify } from "react-spotify-embed";

export default function PlayerEmbed({songId}: {songId: string}) {
    return (
        <Spotify link={`https://open.spotify.com/track/${songId}`} />
    )
}