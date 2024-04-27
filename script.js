// script.js
const CLIENT_ID = '340a545f59344f6f9daf9519af0e41b4';
const REDIRECT_URI = 'http://localhost:8888/callback';
const SCOPES = 'playlist-read-private';
let accessToken;

function authorizeSpotify() {
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
}

function getHashParams() {
  const hashParams = {};
  const hash = window.location.hash.substring(1);
  const params = hash.split('&');
  params.forEach(param => {
    const [key, value] = param.split('=');
    hashParams[key] = decodeURIComponent(value);
  });
  return hashParams;
}

window.onload = function() {
  const params = getHashParams();
  accessToken = params.access_token;

  if (accessToken) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('user-name').innerText = data.display_name;
    });
  }
}

function getPlaylists() {
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const playlistsDiv = document.getElementById('playlists');
    playlistsDiv.innerHTML = '<h3>Playlists:</h3>';
    data.items.forEach(item => {
      const playlist = document.createElement('div');
      playlist.innerText = item.name;
      playlistsDiv.appendChild(playlist);
    });
  });
}
