import React from 'react'
import { authorizeUser, getToken, nextSong, init, likeSong, searchForSong } from './spotifyManager'
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

function App() {
  const [songId, setSongId] = React.useState("")
  //TODO dark mode on default and import font
  return (
    <div className="App">
      <button onClick={authorizeUser}>click</button>
      <PlayerEmbed songId={songId}/>
      <button onClick={() => {likeSong(songId); setSongId(nextSong())}}>like song new</button>
      <button onClick={() => {setSongId(nextSong())}}>next song new</button>
      <button onClick={() => {setSongId(init('37nYSBS0MfRCm913QwCCYo'))}}>init</button>
      <button onClick={() => {searchForSong("foreverassdfsdfsdfeasdas")}}>search</button>
    </div>
  )
}

export default App
