import React from "react"
import Card from "@mui/joy/Card"
import { useSwipeable } from "react-swipeable"
import { nextSong, likeSong } from "../spotifyManager"
import ThumbUpAltRounded from "@mui/icons-material/ThumbUpAltRounded"
import Typography from "@mui/joy/Typography"

export default function SwipeArea({songId, setSongId}: {songId: string, setSongId: Function}) {
    const [animationIndex, setAnimationIndex] = React.useState(0)
    const handleSwipeVisuals = (deltaX: number) => {
        let constraintedDeltaX = deltaX > 0 ? Math.min(deltaX, 400) : Math.max(deltaX, -400)
        constraintedDeltaX /= (40/9)
        constraintedDeltaX = Math.abs(constraintedDeltaX) < 30 ? 0 : constraintedDeltaX
        setAnimationIndex(constraintedDeltaX)
    }
    const handlers = useSwipeable({
        onSwipedRight: (eventData) => {
            if (Math.abs(animationIndex) > 30){
                likeSong(songId)
                setSongId(nextSong())
            }
        },
        onSwiped: (eventData) => setAnimationIndex(0),
        onSwipedLeft: (eventData) => {
            if (Math.abs(animationIndex) > 30){
                setSongId(nextSong())
            }
        },
        onSwiping: (eventData) => {
            handleSwipeVisuals(eventData.deltaX)
        },
        trackMouse: true,
        trackTouch: true,
        delta: 80,
      });
    return (
        <Card {...handlers} variant="soft" sx={(theme) => 
            ({maxWidth: "100%", height: "6rem", display: "flex",
             alignItems: "center", justifyContent: "center",
             background: `${animationIndex === 0 ?
                "" :  animationIndex > 0 ?
                theme.vars.palette.success[700] :
                theme.vars.palette.danger[700]
            }`,
            transition: "ease-out 400ms",
            marginTop: "0 !important"
             })}>
            <Typography level="body-md" sx={{
                opacity: "80%",
                userSelect: "none",
            }}>Swipe here!</Typography>
            <ThumbUpAltRounded sx={{
                transform: `RotateZ(${270+animationIndex}deg)`,
                opacity: `${Math.abs(animationIndex)*1.5}%`,
                transition: "ease-out 400ms",
                fontSize: "5em"
                }}/> 
        </Card>
    )
}