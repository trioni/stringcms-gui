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
        data: btoa(JSON.stringify(body))
      })
    })
  }
}

export default Api;