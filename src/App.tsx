import React from 'react'
import { getToken, addLikedSongsToPlaylist } from './spotifyManager'
import { CssVarsProvider } from '@mui/joy/styles'
import Sheet from "@mui/joy/Sheet"
import Stack from "@mui/joy/Stack"
import TopBar from './Components/TopBar'
import Card from "@mui/joy/Card"
import MainPage from './Containers/MainPage'

function App() {
  const [songId, setSongId] = React.useState("")
  const [stage, setStage] = React.useState(0)

  let code: string | null
  window.onload = () => {
    //if url has an auth code, get an access token
    const urlParams = new URLSearchParams(window.location.search)
    code = urlParams.get('code')
    if (typeof code === "string" && stage === 0) {
      window.history.pushState({}, document.title, "/spotify-playlist-maker" );
      getToken(code).then(r => {
        setStage(1)
      })
      if (!code) {
        console.log(urlParams.get('error'))
      }
    }
  }

  React.useEffect(() => {
    if (stage === 1 && songId !== "") {
      setStage(2)
    }
  }, [songId, stage])
  return (
    <CssVarsProvider defaultMode="dark">
      <Sheet variant="outlined" sx={{ height: "100vh", border: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <Stack justifyContent="flex-start" alignItems="center" spacing={2} height="100%" pb={2}>
          <TopBar />
          <Card sx={{ minWidth: "min(50rem, 90%)", width: "fit-content", maxWidth: "50rem", height: "100%" }}>
            <MainPage stage={stage} setSongId={setSongId} songId={songId} setStage={setStage}/>
          </Card>
        </Stack>
      </Sheet>
    </CssVarsProvider>
  )
}

export default App
