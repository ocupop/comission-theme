import React from 'react';

function replaceNewLines(str) {
  return str.replace(/\r/g, '\\r');
  // return str.replace(/[\r\n]/g, (char) => JSON.stringify(char).slice(1,-1))
}
export default function DABSelector(props) {
  console.log(props);
  const str = replaceNewLines(props.product);
  const product = JSON.parse(str);

  console.log('product', JSON.parse(product));
  // console.log(props.note);
  // const meta = JSON.parse(metafields);
  const unavailableTiles = product.unavailable ? JSON.parse(product.unavailable.value) : [];
  // console.log(unavailableTiles);
  return (
    <>
      <h3>DAB</h3>
      <p>{props.note}</p>
    </>
  );
}
