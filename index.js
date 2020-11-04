;(() => {
  const key = 'spotify-at'

  function createLoginUrl() {
    const clientId = document.getElementById('clientId').value
    const scope = document.getElementById('scope').value
    const clientSecret = document.getElementById('clientSecret').value
    const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(location.origin)}`

    localStorage.setItem(
      key,
      JSON.stringify({
        clientId,
        clientSecret,
      })
    )

    return loginUrl
  }

  function getRefreshToken() {
    const savedStr = localStorage.getItem(key)

    if (!savedStr) return

    const { clientSecret, clientId } = JSON.parse(savedStr)

    if (!clientSecret || !clientId) {
      alert('client secret or id is not found!')
      return
    }

    const paramsString = location.search.substring(1)
    const searchParams = new URLSearchParams(paramsString)
    const code = searchParams.get('code')
    console.log(code)
    if (!code) {
      alert('code is not found!')
      return
    }

    const auth = btoa(`${clientId}:${clientSecret}`)
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', location.origin)

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(key, '')
        document.getElementById('refreshToken').innerText = data.refresh_token
      })
  }

  btn.addEventListener('click', () => {
    location.href = createLoginUrl()
  })

  getRefreshToken()
})()
