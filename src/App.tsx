import React from 'react'
import { authorizeUser, getToken } from './spotifyManager'
import PlayerEmbed from './Components/PlayerEmbed'

let code: string | null
let isUserLoggedIn = false
window.onload = () => {
  //if url has an auth code, get an access token
  const urlParams = new URLSearchParams(window.location.search)
  code = urlParams.get('code')
  if (typeof code === "string") {
    getToken(code).then(r => {
      //TODO: notify user that login was successful
      isUserLoggedIn = true
    })
  }
  if (!code) {
    console.log(urlParams.get('error'))
  }
}
//@ts-ignore
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById('embed-iframe');
  const options = {
      uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
    };
    //@ts-ignore
  const callback = (EmbedController) => {};
  IFrameAPI.createController(element, options, callback);
}

function App() {
  //TODO dark mode on default and import font
  return (
    <div className="App">
      <button onClick={authorizeUser}>click</button>
      <PlayerEmbed />
      
    </div>
  )
}

export default App
