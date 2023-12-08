import React from 'react'
import { authorizeUser, getToken, getSong, addLikedSong, getRecommendations, nextSong, init, likeSong } from './spotifyManager'
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
      <button onClick={() => {setSongId('37nYSBS0MfRCm913QwCCYo')}}>song</button>
      <button onClick={() => {getSong('37nYSBS0MfRCm913QwCCYo').then(r => {addLikedSong(r)})}}>consolelog</button>
      <button onClick={() => {getSong(songId).then(r => {addLikedSong(r)})}}>like</button>
      <button onClick={() => {getRecommendations().then(r => {setSongId(r.tracks[0].id)})}}>rec</button>
      <button onClick={() => {likeSong(songId); setSongId(nextSong())}}>like song new</button>
      <button onClick={() => {setSongId(nextSong())}}>next song new</button>
      <button onClick={() => {init('37nYSBS0MfRCm913QwCCYo'); setSongId(nextSong())}}>init</button>
    </div>
  )
}

export default App
