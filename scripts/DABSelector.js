import React from 'react';

function replaceNewLines(str) {
  return str.replace(/\r/g, '\\r');
  // return str.replace(/[\r\n]/g, (char) => JSON.stringify(char).slice(1,-1))
}
export default function DABSelector(props) {
  const productJsonString = props.product.replace(/\\/g, '');
  const product = JSON.parse(replaceNewLines(productJsonString));

  console.log('product', product);
  // // console.log(props.note);
  // // const meta = JSON.parse(metafields);
  // const unavailableTiles = product.unavailable ? JSON.parse(product.unavailable.value) : [];
  // // console.log(unavailableTiles);
  return (
    <>
      <h3>DAB</h3>
      <p>{props.note}</p>
    </>
  );
}
