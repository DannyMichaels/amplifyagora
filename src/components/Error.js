import React from 'react';

const Error = ({ errors }) => (
  <pre classname="error">
    {errors.map((err, idx) => (
      <div key={idx}>{err.message}</div>
    ))}
  </pre>
);

export default Error;
