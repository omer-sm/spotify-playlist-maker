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


function App() {
  const [songId, setSongId] = React.useState("")
  /*React.useEffect(() => {
    setSongId('spotify:track:37nYSBS0MfRCm913QwCCYo')
  }, [])*/
  //TODO dark mode on default and import font
  return (
    <div className="App">
      <button onClick={authorizeUser}>click</button>
      <PlayerEmbed songId={songId}/>
      <button onClick={() => {setSongId('spotify:track:37nYSBS0MfRCm913QwCCYo')}}>song</button>
    </div>
  )
}

export default App
