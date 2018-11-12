const USE_PROXY = process.env.REACT_APP_USE_PROXY;
const HOST = USE_PROXY ? '/app/storage' : 'http://localhost:8085/app/storage';
const RESOURCE = '/en-locale.json';

async function parseResponse(res) {
  if (res.ok) {
    const etag = res.headers.get('ETag');
    const contentType = res.headers.get('Content-Type');
    for (let header of res.headers) {
      console.log('HEADER --> ', header);
    }
    console.log(
      'Response',
      res
    )
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
        // Authorization: 'Basic abc',
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