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
const scope = 'user-read-private user-read-email'
const authUrl = new URL("https://accounts.spotify.com/authorize")
const redirectUri = "http://localhost:3000"
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
    } else {
        console.error("Error: cant refresh token as there was no refresh_token stored")
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

export const addLikedSong = (song: ISong | void) => {
    if (song) {
        likedSongs.push(song)
    }
}
export const getSong = async (id: string) => {
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
    try {
        const body = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        })
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
    } catch (e) {
        console.error(e)
    }
    return songObj
}

export const getRecommendations = async () => {
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
        params.target_acousticness += Math.round(song.acousticness * 20)/100
        params.target_danceability += Math.round(song.danceability * 20)/100
        params.target_energy += Math.round(song.energy * 20)/100
        params.target_instrumentalness += Math.round(song.instrumentalness * 20)/100
        params.target_liveness += Math.round(song.liveness * 20)/100
        params.target_loudness += Math.round(song.loudness * 20)/100
        params.target_tempo += Math.round(song.tempo * 20)/100
        params.target_valence += Math.round(song.valence * 20)/100
    })
    params.seed_tracks = params.seed_tracks.slice(0, -1)
    const urlParams = new URLSearchParams("")
    for (const [key, value] of Object.entries(params)) {
        urlParams.append(key, value.toString())
    }
    try {
        const body = await fetch(`https://api.spotify.com/v1/recommendations?${urlParams.toString()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        })
        const obj = await body.json()
        setTimeout(()=> {}, 500)
        return obj
    } catch (e) {
        console.error(e)
    }
}

let songQueue: string[] = []

const refreshQueue = () => {
    getRecommendations().then(r => {
        songQueue = r.tracks.map((song: any) => {return song.id})
    })
}

const getSongFromQueue = ():string => {
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
    }).catch(e => {console.error(e)})
} 

export const init = (songId: string) => {
    likeSong(songId)
    
}



