import React from 'react';

const Debug = ({ data, className }) => {
  const isObject = typeof data === 'object';
  const isString = typeof data === 'string';
  return (
    <div className={className}>
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