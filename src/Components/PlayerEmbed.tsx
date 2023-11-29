import React from "react"


export default function PlayerEmbed({songId}: {songId: string}) {
    let controller: any
    //@ts-ignore
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById('embed-iframe');
        const options = {
            uri: 'spotify:track:2YSzYUF3jWqb9YP9VXmpjE'
        };
        //@ts-ignore
        const callback = (EmbedController) => {
            EmbedController.loadUri(songId)
        };
        IFrameAPI.createController(element, options, callback);
    }
    React.useEffect(() => {
        //@ts-ignore
        //controller.loadUri(songId)
    }, [songId]);
    return (
        <div id="embed-iframe"></div>
    )
}