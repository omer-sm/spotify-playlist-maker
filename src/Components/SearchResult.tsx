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
        <Card sx={{p: "0", maxHeight: "6rem"}} variant="soft">
            <Stack direction="row" alignItems="center" spacing={2} justifyItems="stretch" height="6rem" justifyContent="space-between">
                <Stack direction="row" spacing={2} justifyContent="center">
                <img src={imageUrl} alt="song icon" style={{maxHeight: "6rem"}}/>
                <Stack spacing={1} justifyContent="center">
                    <Typography level="h2" sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "30rem"}}>{name}</Typography>
                    <Typography level="body-md" sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "30rem"}}>{artist}</Typography>
                </Stack>
                </Stack>
                <IconButton sx={{width: "6rem"}} onClick={() => {chooseResult()}}>
                    <CheckCircleTwoToneIcon sx={{width: "70%", height: "70%"}}/></IconButton>
            </Stack>
        </Card>
    )
}