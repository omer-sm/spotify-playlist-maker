import React from "react"
import Typography from "@mui/joy/Typography"
import LogInPage from "./LogInPage"
import SearchSongPage from "./SearchSongPage"
import SongChoosingPage from "./SongChoosingPage"

export default function MainPage({stage, setStage, setSongId, songId}: {stage: number, setStage: Function, setSongId: Function, songId: string}) {
    switch (stage) {
        case 0:
            return <LogInPage/>
        case 1:
            return <SearchSongPage setSongId={setSongId}/>
        case 2:
            return <SongChoosingPage setSongId={setSongId} songId={songId} setStage={setStage}/>
    }
    return <Typography level="h3">An error occurred :(</Typography>
}