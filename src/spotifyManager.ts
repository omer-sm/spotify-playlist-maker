//do code challenge
const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}
const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}
const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}

const getCodeChallenge = async () => {
    const codeVerifier = generateRandomString(64)
    localStorage.setItem('code_verifier', codeVerifier)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)
    return codeChallenge
}

//handle user authorization
const clientID = "3423964c454a45518f97e5ade891b01e"
const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'
const authUrl = new URL("https://accounts.spotify.com/authorize")
const redirectUri = "https://omer-sm.github.io/spotify-playlist-maker"//"http://localhost:3000"
const requestUserAuth = (codeChallenge: string) => {
    const params = {
        response_type: 'code',
        client_id: clientID,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }
    authUrl.search = new URLSearchParams(params).toString()
    window.location.href = authUrl.toString()
}
export const authorizeUser = () => {
    getCodeChallenge().then(r => {
        requestUserAuth(r)
    }).catch(e => {
        console.log(e)
    })
}
/**
 * gets an access token when the user first logs in
 * @param code auth code returned from login page
 */
export const getToken = async (code: string) => {
    let codeVerifier = localStorage.getItem('code_verifier')
    if (typeof codeVerifier === "string") {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        }
        const body = await fetch("https://accounts.spotify.com/api/token", payload)
        const response = await body.json()
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
    } else {
        console.error("Error: code verifier is undefined.")
    }
}
/**
 * refreshes the access token
 */
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
        const url = "https://accounts.spotify.com/api/token"
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientID
            }),
        }
        const body = await fetch(url, payload)
        const response = await body.json()
        localStorage.setItem('access_token', response.accessToken)
        localStorage.setItem('refresh_token', response.refreshToken)
        console.log(`refreshed token: ${response.access_token}`)
    } else {
        console.error("Error: cant refresh token as there was no refresh_token stored")
    }
}

const checkFetch = (response: Response) => {
    if (response.ok) {
        return
    }
    switch (response.status) {
        case 400:
            window.alert(`bad request: ${response.url}`)
            throw new Error(`bad request: ${response.url}`)
        case 401:
            window.alert(`unauthorized: ${response.url}`)
            //refreshToken()
            throw new Error(`unauthorized: ${response.url}`)
    }
}

interface ISong {
    id: string
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    liveness: number
    loudness: number
    tempo: number
    valence: number
}

const likedSongs: ISong[] = []

const addLikedSong = (song: ISong | void) => {
    if (song) {
        likedSongs.push(song)
    }
}
const getSong = async (id: string) => {
    const accessToken = localStorage.getItem('access_token')
    let songObj: ISong = {
        id: "",
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        liveness: 0,
        loudness: 0,
        tempo: 0,
        valence: 0,
    }
    const body = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    })
    try {
        checkFetch(body)
    }
    catch (e) {
        console.log(e)
        return
    }
    const song = await body.json()
    songObj = {
        id: song.id,
        acousticness: song.acousticness,
        danceability: song.danceability,
        energy: song.energy,
        instrumentalness: song.instrumentalness,
        liveness: song.liveness,
        loudness: song.loudness,
        tempo: song.tempo,
        valence: song.valence,
    }
    return songObj
}

const getRecommendations = async () => {
    const accessToken = localStorage.getItem('access_token')
    const params = {
        limit: 15,
        seed_tracks: "",
        target_acousticness: 0,
        target_danceability: 0,
        target_energy: 0,
        target_instrumentalness: 0,
        target_liveness: 0,
        target_loudness: 0,
        target_tempo: 0,
        target_valence: 0,
    }
    likedSongs.slice(-5).forEach((song: ISong) => {
        params.seed_tracks += `${song.id},`
        params.target_acousticness += Math.round(song.acousticness * 20) / 100
        params.target_danceability += Math.round(song.danceability * 20) / 100
        params.target_energy += Math.round(song.energy * 20) / 100
        params.target_instrumentalness += Math.round(song.instrumentalness * 20) / 100
        params.target_liveness += Math.round(song.liveness * 20) / 100
        params.target_loudness += Math.round(song.loudness * 20) / 100
        params.target_tempo += Math.round(song.tempo * 20) / 100
        params.target_valence += Math.round(song.valence * 20) / 100
    })
    params.seed_tracks = params.seed_tracks.slice(0, -1)
    const urlParams = new URLSearchParams("")
    for (const [key, value] of Object.entries(params)) {
        urlParams.append(key, value.toString())
    }
    const body = await fetch(`https://api.spotify.com/v1/recommendations?${urlParams.toString()}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    })
    try {
        checkFetch(body)
    }
    catch (e) {
        console.log(e)
        return
    }
    const obj = await body.json()
    setTimeout(() => { }, 500)
    return obj
}

let songQueue: string[] = []

const refreshQueue = () => {
    getRecommendations().then(r => {
        songQueue = r.tracks.map((song: any) => { return song.id })
    })
}

const getSongFromQueue = (): string => {
    songQueue.reverse()
    const ret = songQueue.pop()
    songQueue.reverse()
    return typeof ret === "string" ? ret : '37nYSBS0MfRCm913QwCCYo'
}

export const nextSong = () => {
    const id = getSongFromQueue()
    if (!songQueue.length) {
        refreshQueue()
    }
    return id
}

export const likeSong = (songId: string) => {
    getSong(songId).then(songObj => {
        addLikedSong(songObj)
        refreshQueue()
    }).catch(e => { console.error(e) })
}

export const init = (songId: string) => {
    likeSong(songId)
    return getSongFromQueue()
}

export interface ISearchResult {
    id: string,
    name: string,
    artist: string,
    imageUrl: string,
}

interface IArtistResult {
    name: string
}

const getArtistNames = (artists: IArtistResult[]) => {
    let names = ""
    artists.forEach((artist: IArtistResult) => {
        names += artist.name + ", "
    })
    return names.slice(0, -2)
}

export const searchForSong = async (query: string) => {
    const accessToken = localStorage.getItem('access_token')
    const params = {
        query: query,
        type: "track",
        limit: "5",
    }
    const urlParams = new URLSearchParams("")
    for (const [key, value] of Object.entries(params)) {
        urlParams.append(key, value.toString())
    }
    const response = await fetch(`https://api.spotify.com/v1/search?${urlParams.toString()}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    })
    try {
        checkFetch(response)
    }
    catch (e) {
        console.log(e)
        return
    }
    const results = await response.json()
    const resultsObj: ISearchResult[] = results.tracks.items.map((item: any) => {
        return {
            id: item.id,
            name: item.name,
            artist: getArtistNames(item.artists),
            imageUrl: item.album.images[0].url,
        }
    })
    return resultsObj
}

let userId = ""

const getUserId = async () => {
    if (userId.length) {
        return userId
    }
    const accessToken = localStorage.getItem('access_token')
    const body = await fetch("https://api.spotify.com/v1/me", {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    })
    try {
        checkFetch(body)
    }
    catch (e) {
        console.log(e)
        return
    }
    const obj = await body.json()
    userId = obj.id
    return userId
}

const createPlaylist = async () => {
    const accessToken = localStorage.getItem('access_token')
    const id = await getUserId()
    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: `{\n"name": "Songs I swiped right on!",\n"description": "made with omer's playlist maker thing :)",\n"public": false\n}`
    })
    try {
        checkFetch(response)
    }
    catch (e) {
        console.log(e)
        return
    }
    const obj = await response.json()
    return obj.id
}

let playlistId = ""

export const getPlaylistId = async () => {
    if (playlistId.length) {
        return playlistId
    }
    const id = await createPlaylist()
    playlistId = id
    return id
}

const getLikedSongsIDs = () => {
    let s = ""
    likedSongs.forEach(song => {
        s += `"spotify:track:${song.id}",`
    })
    s = s.slice(0, -1)
    return s
}

export const addLikedSongsToPlaylist = async () => {
    if (likedSongs.length > 90) {
        console.log("liked songs is too big :(")
    }
    const id = await getPlaylistId()
    const accessToken = localStorage.getItem('access_token')
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: `{\n"uris": [${getLikedSongsIDs()}]}`
    })
    try {
        checkFetch(response)
    }
    catch (e) {
        console.log(e)
        return false
    }
    return true
}

