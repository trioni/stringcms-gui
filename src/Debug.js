import React from 'react';

const Debug = ({ data }) => {
  const isObject = typeof data === 'object';
  const isString = typeof data === 'string';
  return (
    <div>
      {isObject && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
      {isString && (
        <pre>{data}</pre>
      )}
    </div>
  );
}
 
export default Debug;