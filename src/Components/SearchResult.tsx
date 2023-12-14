import React from "react"
import Card from "@mui/joy/Card"
import Typography from "@mui/joy/Typography"
import { ISearchResult } from "../spotifyManager"
import Stack from "@mui/joy/Stack"
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import IconButton from "@mui/joy/IconButton"

interface IProps extends ISearchResult {
    chooseResult: Function
}

export default function SearchResult({name, artist, imageUrl, chooseResult}: IProps) {
    
    return (
        <Card sx={{p: "0", maxHeight: "6rem", background: `url(${imageUrl})`}} variant="soft">
            <Stack direction="row" alignItems="center" spacing={2} justifyItems="stretch" height="6rem" justifyContent="space-between" width="101%" sx={{backdropFilter: "brightness(60%)"}}>
                <Stack direction="row" spacing={2} justifyContent="center">
                <Stack spacing={1} justifyContent="center">
                    <Typography level="title-lg" pl={1} sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "30rem"}}>{name}</Typography>
                    <Typography level="body-md" pl={1} sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "30rem"}}>{artist}</Typography>
                </Stack>
                </Stack>
                <IconButton sx={{width: "6rem", height: "6rem"}} onClick={() => {chooseResult()}}>
                    <CheckCircleTwoToneIcon sx={{width: "4rem", height: "4rem"}}/></IconButton>
            </Stack>
        </Card>
    )
}