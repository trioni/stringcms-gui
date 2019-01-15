const USE_PROXY = process.env.REACT_APP_USE_PROXY;
const HOST = USE_PROXY ? '/app/storage' : process.env.REACT_APP_ENDPOINT;
const RESOURCE = '/en-locale.json';

async function parseResponse(res) {
  if (res.ok) {
    const etag = res.headers.get('ETag');
    const contentType = res.headers.get('Content-Type');
    if (contentType.includes('application/json')) {
      return res.json().then((data) => ({
        etag,
        data
      }))
    }

    return res.text();
  }
  return res.text();
}

class Api {
  static getFile() {
    return fetch(`${HOST}${RESOURCE}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(parseResponse);
  }

  static save(body, etag) {
    return fetch(`${HOST}${RESOURCE}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': etag,
      },
      body: JSON.stringify({
        message: 'Commit message from gui',
        userMail: 'master@example.com',
        userInfo: 'From Gui',
        data: btoa(JSON.stringify(body))
      })
    })
  }
}

export default Api;