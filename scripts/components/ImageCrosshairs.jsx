import React from 'react';
/**
 * ImageCrosshairs (used in CartLineitems AND ProductGallery)
 * @param {*} rows Total number of rows in the image
 * @param {*} cols Total number of columns in the image
 * @param {*} position the position of the dab, reading left->right, top->bottom
 * @returns
 */

 export default function ImageCrosshairs({rows,cols,position,animate=true}){
  const zeroPos = position-1 // position adjusted to start at 0 instead of 1
  const positionRow = Math.floor(zeroPos / cols) + 1
  const positionColumn = (zeroPos % cols) + 1
  const dabWidth = (100 / cols)
  const dabHeight = (100 / rows)
  const dabXpos = dabWidth * (positionColumn - 1)
  const dabYpos = dabHeight * (positionRow - 1)
  return (
    <>
      <div className={`variantIndicator absolute top-0 left-0 w-full h-full ${animate && 'animated'}`}>
        <span
          className={`absolute bg-white opacity-80 ${animate ? 'variantIndicator-growdown' : ''} `}
          style={{
            width:dabWidth+"%",
            height:(dabHeight * (positionRow-1))+"%",
            top:0,
            left:dabXpos+"%"
          }}></span>
        <span
          className={`absolute bg-white opacity-80 ${animate ? 'variantIndicator-growup' : ''} `}
          style={{
            width:dabWidth+"%",
            height:((rows-positionRow) * dabHeight)+"%",
            top:(dabHeight * (positionRow))+"%",
            left:dabXpos+"%"
          }}></span>

        <span
          className={`absolute bg-white opacity-80 ${animate ? 'variantIndicator-growright' : ''}`}
          style={{
            width:(dabWidth * (positionColumn-1))+"%",
            height:dabHeight+"%",
            top:dabYpos+"%",
            left:"0"
          }}></span>
        <span
          className={`absolute bg-white opacity-80 ${animate ? 'variantIndicator-growleft' : ''}`}
          style={{
            width:((cols-positionColumn) * dabWidth)+"%",
            height:dabHeight+"%",
            top:dabYpos+"%",
            left:(dabWidth * (positionColumn))+"%",
          }}></span>

        <span
          className={`absolute opacity-100 ${animate ? 'variantIndicator-target' : ''}`}
          style={{
            width:dabWidth+"%",
            height:dabHeight+"%",
            top:dabYpos+"%",
            left:dabXpos+"%"
          }}></span>
      </div>
    </>
  )

}