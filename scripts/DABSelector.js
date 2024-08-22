import React, { useState, useEffect } from 'react';

function replaceNewLines(str) {
  return str.replace(/\r/g, '\\r');
  // return str.replace(/[\r\n]/g, (char) => JSON.stringify(char).slice(1,-1))
}
export default function DABSelector(props) {
  console.log(props);
  const str = replaceNewLines(props.product);
  const product = JSON.parse(str);

  console.log(JSON.parse(product));
  console.log(props.note);
  // const meta = JSON.parse(metafields);
  // console.log(meta);
  return <h3>DAB</h3>;
}
