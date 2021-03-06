import config from './config';

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


// ucs-2 string to base64 encoded ascii
function utoa(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
// eslint-disable-next-line
function atou(str) {
  return decodeURIComponent(escape(atob(str)));
}

async function parseResponse(res) {
  if (res.ok) {
    const etag = res.headers.get('ETag');
    const contentType = res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
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

const DEFAULT_METADATA = {
  contentType: 'application/json',
  users: [],
  write: [{
    role: 'editor'
  }]
};

class BaseApi {
  static fetch(url, init = {}, ...rest) {
    if (!config.storageHost) {
      return Promise.reject(`No endpoint is configured. Make sure to provide a "REACT_APP_ENDPOINT" environment variable pointing to a Jitstatic instance`);
    }
    const urlToCall = `${config.storageHost}${url}`;
    return fetch(urlToCall, init).then(parseResponse);
  }
}

class Api extends BaseApi {
  static getFile(resource) {
    return this.fetch(`/${resource}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  static listKeys() {
    return this.fetch(`?recursive=true&light=true`).then((r) => r.data.result);
  }

  static createJsonFile(filename) {
    const payload = {
      data: btoa(JSON.stringify({ key: 'value'})),
      message: 'Creating file from String CMS',
      userMail: 'stringcms@example.com',
      userInfo: 'Master of Strings',
      metaData: DEFAULT_METADATA,
    };

    return this.fetch(`/${filename}.json`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  }

  static save(resource, body, etag) {
    return this.fetch(`/${resource}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': etag,
      },
      body: JSON.stringify({
        message: 'Commit message from gui',
        userMail: 'stringcms@example.com',
        userInfo: 'Master of Strings',
        data: utoa(JSON.stringify(body))
      })
    })
  }
}

export default Api;