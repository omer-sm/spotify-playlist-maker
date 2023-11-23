import React from 'react'
import { authorizeUser, getToken } from './spotifyManager'

let code: string | null
window.onload = () => {
  //if url has an auth code, get an access token
  const urlParams = new URLSearchParams(window.location.search)
  code = urlParams.get('code')
  if (typeof code === "string") {
    getToken(code).then(r => {
      //TODO: notify user that login was successful
    })
  }
  if (!code) {
    console.log(urlParams.get('error'))
  }
}
function App() {
  //TODO dark mode on default and import font
  return (
    <div className="App">
      <button onClick={authorizeUser}>click</button>
    </div>
  )
}

export default App
