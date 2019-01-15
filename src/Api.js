const USE_PROXY = process.env.REACT_APP_USE_PROXY;
const HOST = USE_PROXY ? '/app/storage' : process.env.REACT_APP_ENDPOINT;
class ExtendableError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class ApiError extends ExtendableError {}

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

  let errorJson = {
    message: 'Error getting data',
    code: 500,
  };

  try {
    errorJson = await res.json();
  } catch (err) {
    // do nothing
  }
  throw new ApiError(errorJson.message, errorJson.code);
}

class Api {
  static getFile(resource) {
    return fetch(`${HOST}/${resource}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(parseResponse);
  }

  static listKeys() {
    return fetch(`${HOST}?recursive=true&light=true`).then(parseResponse).then((r) => r.data.result);
  }

  static save(resource, body, etag) {
    return fetch(`${HOST}/${resource}`, {
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