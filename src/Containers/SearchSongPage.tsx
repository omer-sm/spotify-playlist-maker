import React from "react"
import SongSearchInput from "../Components/SongSearchInput"
import SearchResult from "../Components/SearchResult"
import { ISearchResult } from "../spotifyManager"
import { likeSong } from "../spotifyManager"
import Card from "@mui/joy/Card"

export default function SearchSongPage({setSongId}: {setSongId: Function}) {
    const [results, setResults] = React.useState<ISearchResult[]>([])
    return (
        <>
        <SongSearchInput setResults={setResults}/>
        <Card>
        {results.length !== 0 && results.map(result => {
            return <SearchResult id={""} name={result.name} artist={result.artist} 
            imageUrl={result.imageUrl} chooseResult={() => {
                likeSong(result.id) 
                setSongId((result.id))
            }}/>
        })}
        </Card>
        </>
    )
}