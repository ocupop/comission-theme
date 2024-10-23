import React, { useState, useEffect, useCallback } from 'react';

function replaceNewLines(str) {
  return str.replace(/\r/g, '\\r');
  // return str.replace(/[\r\n]/g, (char) => JSON.stringify(char).slice(1,-1))
}
export default function DABSelector(props) {
  const product = JSON.parse(decodeURIComponent(props.product));
  const metafields = JSON.parse(decodeURIComponent(props.productmetafields));
  const variants = JSON.parse(decodeURIComponent(props.variants));
  const artist = JSON.parse(decodeURIComponent(props.artist));
  const museum = JSON.parse(decodeURIComponent(props.museum));
  const museumAttributes = JSON.parse(decodeURIComponent(props.museumattributes));
  const cartItems = JSON.parse(decodeURIComponent(props.cart));
  const { id, handle } = product;
  const { rows, cols, unavailable, startDate, endDate, tiles: initialTiles = [] } = metafields;

  //  const {linesAdd, lines} = useCart();
  const [lines, setLines] = useState(cartItems);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [tiles, setTiles] = useState();
  const [isHovering, setIsHovering] = useState(false);
  const [isTooltipHovered, setTooltipHovered] = useState(false);
  const [hoverTileData, setHoverTileData] = useState(false);
  const [zoom, setZoom] = useState(1.5);
  const [coords, setCoords] = useState({ x: 0, y: 0, absoluteX: 0, absoluteY: 0 });
  const [tooltipOrientation, setTooltipOrientation] = useState({ x: 0, y: 0, absoluteX: 0, absoluteY: 0 });

  const unavailableTiles = unavailable || []; // TODO: get rid of unavailableTiles
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (!rows || !cols) return; // in case we have a malformed product, just skip this component

  useEffect(() => {
    // console.log('MUSEUM', museum);
    // console.log('ARTIST', artist);
    // console.log('PRODUCT', product);
    // console.log('VARIANTS', variants);
    // console.log('CART', cartItems);
    // console.log('MUSEUM ATTRUBUTES', museumAttributes);

    // loop through all of the variant "tiles" metafields, and create an object assigning each tile dbId to a variantId
    let tileVariantLookup = {};
    // = JSON.parse(product.tiles)
    let defaultVariant = null;
    variants.map((variant) => {
      const theseTiles = variant.tiles && JSON.parse(variant.tiles);
      if (theseTiles && theseTiles.length > 0) {
        theseTiles.forEach((id, i) => {
          tileVariantLookup[id] = { variantId: variant.id, price: variant.price };
        });
      } else {
        // This variant has no "tile" metafield (or it is empty), so we will make it the default variant.
        // Any tile not specified in another variant will be assigned to this one.
        // This allows us to set the price of every tile without having to explicity set a JSON object in a variant.
        // (If there is more than one default variant, only one will be used.)
        defaultVariant = variant;
      }
    });
    // Loop through each tile and add the variant id
    const allTilesWithVariants = new Array(rows * cols).fill().map((tile, i) => {
      const tileFromDb = initialTiles.find((tile) => tile.position === i + 1);

      const isInCart = lines.find((line) => {
        return line.product_id == id && line.properties.position == i + 1;
      });

      return {
        ...tileFromDb,
        position: i + 1,
        price: tileVariantLookup[i + 1]?.price ? tileVariantLookup[i + 1].price : defaultVariant?.price,
        variantId: tileVariantLookup[i + 1]?.variantId ? tileVariantLookup[i + 1].variantId : defaultVariant?.id,
        isSold: tileFromDb?.order !== undefined,
        isUnavailable: unavailableTiles.indexOf(i + 1) > -1,
        isInCart,
      };
    });

    const sortedTiles = allTilesWithVariants.sort((a, b) => (a.position > b.position ? 1 : -1));

    setTiles(sortedTiles);
  }, []);
  // }, [product, lines]); // ERROR: causes an endless loop...

  // useEffect(() => {
  //   console.log('updated the selected tile');
  //   // onSelectedTilesUpdated(selectedTiles)
  // }, [selectedTiles]);

  const mouseOverWindow = (event) => {
    // Disable for small screens
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    setIsHovering(true);
  };

  const mouseOutWindow = (event) => {
    setIsHovering(false);
  };

  const clickedWindow = (event) => {
    if (typeof window !== 'undefined') {
      console.log('clickedWindow');
      //     const xpos = event.clientX - (event.currentTarget.parentNode.parentNode.offsetLeft + 24); // 24 = the modal window padding
      //     const ypos = event.clientY - (event.currentTarget.parentNode.parentNode.offsetTop + 24); // 24 = the modal window padding
      //     const xPercent = xpos / event.currentTarget.offsetWidth;
      //     const yPercent = ypos / event.currentTarget.offsetHeight;

      //     setTooltipOrientation({
      //       x: xPercent < 0.1 ? 'right' : xPercent > 0.9 ? 'left' : 'center',
      //       y: yPercent > 0.6 ? 'top' : 'bottom',
      //     });
    }
  };
  const handleMouseMove = (event) => {
    if (typeof window !== 'undefined') {
      const xpos = event.clientX - (event.currentTarget.parentNode.parentNode.offsetLeft + 24); // 24 = the modal window padding
      const ypos = event.clientY - (event.currentTarget.parentNode.parentNode.offsetTop + 24); // 24 = the modal window padding
      const xPercent = xpos / event.currentTarget.offsetWidth;
      const yPercent = ypos / event.currentTarget.offsetHeight;
      const xScrollAmount = (event.currentTarget.offsetWidth * zoom - event.currentTarget.offsetWidth) * xPercent * -1;
      const yScrollAmount =
        (event.currentTarget.parentNode.offsetHeight * zoom - event.currentTarget.offsetHeight) * yPercent * -1;
      // if(xPercent < 0.1) { set tooltip to be more "right-ish"      }
      // if(xPercent > 0.9) { set tooltip to be more "right-ish"      }
      // if(yPercent > 0.6) { set tooltip to be above tile      }
      setCoords({
        absoluteX: event.clientX,
        absoluteY: event.clientY,
        x: xScrollAmount,
        y: yScrollAmount,
        tooltipXpos: xPercent < 0.1 ? 'right' : xPercent > 0.9 ? 'left' : 'center',
        tooltipYpos: yPercent > 0.6 ? 'top' : 'bottom',
      });
    }
  };

  const hoverTile = (tile) => {
    setHoverTileData(tile);
  };

  const isTileSelected = (tile) => {
    return selectedTiles.find((element) => element.position == tile.position);
  };
  const toggleTile = (tile, pos) => {
    if (selectedTiles.findIndex((object) => object.position === tile.position) > -1) {
      // only splice array when item is found
      setSelectedTiles(selectedTiles.filter((data) => data.position != tile.position));
    } else {
      //setSelectedTiles([...selectedTiles,tile]) // To select multiple tiles at once
      setSelectedTiles([{ ...tile, pos }]);
    }
  };

  const purchaseTile = async (e, tile) => {
    const attributes = {
      position: tile.position.toString(),
      // {key:"_tile_id",value:tile.id},
      _product_id: id.toString().replace(/\D/g, ''),
      _handle: handle,
      _startdate: startDate || 'none',
      _enddate: endDate || 'none',
      _museum_name: museum ? museum.title : '',
      _museum_handle: museum ? museum.handle : '',
      _museum_id: museum ? museum.id.toString().replace(/\D/g, '') : '',
      _museum_location:
        museumAttributes?.city && museumAttributes?.state ? `${museumAttributes.city}, ${museumAttributes.state}` : '',
      _museum_corporatename: museumAttributes?.corporateName ? museumAttributes.corporateName : '',
      _museum_taxid: museumAttributes?.taxId ? museumAttributes.taxId : '',
      _artist_name: artist ? artist.title : '',
      _artist_handle: artist ? artist.handle : '',
    };

    let formData = {
      items: [{ id: tile.variantId, quantity: 1, properties: attributes }],
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        window.location.href = '/cart';
      });
  };

  const getToolTipContent = (tile) => {
    if (tile.isInCart) {
      return (
        <div className="text-xs">
          Already in <Link to="/cart">your cart</Link>
        </div>
      );
    }
    if (tile.isSold) {
      return <div className="text-xs">Sold on {format(new Date(tile.order.date), 'MMMM d, yyyy')}</div>;
    }
    if (tile.isUnavailable || tile.isSold) {
      return <div className="text-xs">This tile is unavailable</div>;
    }
    return (
      <>
        <div className="flex items-start mb-2">
          {/* <img src={`${FIREBASE_STORAGE_PATH}${tile.tilePath}`} alt={tile.order} className="w-12 mr-2 max-w-1/2"/> */}
          <div className="text-xs">
            DAB #{tile.position} <br />
            Price: {formatter.format(tile.price)}
          </div>
        </div>
        <button className="p-2 text-xs text-white bg-blue-600 hover:bg-blue-400" onClick={(e) => purchaseTile(e, tile)}>
          Purchase DAB
        </button>
        <p className="mt-3 text-xs whitespace-normal w-28">
          Your purchase is tax deductible within the guidelines of U.S. law.
        </p>
      </>
    );
  };
  const getToolTipHoverContent = (tile) => {
    if (tile.isInCart) {
      return (
        <>
          <div className="flex justify-between w-full">
            <span>DAB {hoverTileData.position}</span>
            <span className="font-bold">IN YOUR CART</span>
          </div>
        </>
      );
    }
    if (tile.order || tile.isUnavailable) {
      return (
        <>
          <div className="flex justify-between w-full">
            <span>DAB {hoverTileData.position}</span>
            <span className="font-bold">UNAVAILABLE</span>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="flex justify-between w-full">
          <span>DAB {hoverTileData.position}</span>
          <span className="font-bold">{formatter.format(hoverTileData.price)}</span>
        </div>
        <div className="text-xs text-inherit">Your purchase is tax deductible within the guidelines of U.S. law.</div>
      </>
    );
  };

  return (
    <>
      {isHovering && hoverTileData && !isTooltipHovered && !isTileSelected(hoverTileData) && (
        <div
          className="tooltip hover-tooltip bg-opacity-90 -translate-x-1/2 translate-y-2 fixed bg-black text-white p-2 w-[200px] z-20 pointer-events-none"
          style={{ top: coords.absoluteY + 'px', left: coords.absoluteX + 'px', zIndex: 51 }}
        >
          {getToolTipHoverContent(hoverTileData)}
        </div>
      )}

      <div
        className="relative inline-block w-auto text-center border border-dark"
        onMouseMove={handleMouseMove}
        onMouseEnter={mouseOverWindow}
        onMouseLeave={mouseOutWindow}
        onClick={clickedWindow}
      >
        <div className="overflow-visible">
          <div
            className="relative transition-all duration-1000 origin-top-left"
            style={{
              maxHeight: '100vh',
              transform: isHovering ? `scale(${zoom})` : `scale(1)`,
              top: isHovering ? coords.y + 'px' : 0,
              left: isHovering ? coords.x + 'px' : 0,
            }}
          >
            <img
              className="pointer-events-none"
              style={{ maxHeight: 'calc(100vh - 115px)' }}
              src={product.media[0]?.src}
              alt={product.media[0]?.alt}
            />
            <div
              className="absolute top-0 left-0 grid w-full h-full gap-px whitespace-nowrap"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
              }}
            >
              {tiles &&
                tiles.length > 0 &&
                tiles.map((tile, i) => {
                  return (
                    <Dab
                      key={tile.position}
                      tile={tile}
                      zoom={zoom}
                      onClick={toggleTile}
                      onHover={hoverTile}
                      isInactive={tile.isUnavailable || tile.isInCart || tile.isSold}
                      // onMouseOut={hoverOffTile}
                      isSelected={selectedTiles.findIndex((object) => object.position === tile.position) > -1}
                    />
                  );
                })}
            </div>
            <div
              className="z-50 tooltips"
              onMouseEnter={() => setTooltipHovered(true)}
              onMouseLeave={() => setTooltipHovered(false)}
            >
              {selectedTiles.map((tile) => {
                // Tooltip Arrow placement isn't exact. Could use a little refactoring.
                // look at index.css for more styles.
                const tooltipTransform = `translateX(${
                  tooltipOrientation.x === 'right' ? `0` : tooltipOrientation.x === 'left' ? `-100%` : `-50%`
                }) ${isHovering ? `scale(${1 / zoom})` : `scale(1)`} ${
                  tooltipOrientation.y === 'top' ? 'translateY(-125%) ' : ''
                }`;
                const tooltipMargin =
                  tooltipOrientation.x === 'right'
                    ? { marginLeft: `-${15 / zoom}px` }
                    : tooltipOrientation.x === 'left'
                    ? { marginLeft: `${15 / zoom}px` }
                    : ``;
                return (
                  <div
                    key={tile.position}
                    style={{ left: tile.pos.x, top: tile.pos.y, transform: tooltipTransform, ...tooltipMargin }}
                    className={`tooltip absolute bg-white p-2 left-1/2 text-left z-50 ${tooltipOrientation.x} ${tooltipOrientation.y}`}
                  >
                    {getToolTipContent(tile)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Dab({ tile, isSelected, isInactive, onClick, onHover }) {
  let tileClass = 'dab relative hover:outline hover:outline-1 cursor-pointer ';
  if (isSelected) tileClass += 'selected z-30 border-2 border-grey';
  if (tile.orderNumber) {
    tileClass += 'hover:outline-red-600 bg-black bg-opacity-50 opacity-50 hover:z-10 '; // purchased
  } else if (isInactive) {
    tileClass += 'hover:outline-red-500 hover:z-20 '; // inactive
  } else {
    tileClass += 'hover:outline-black hover:z-20 '; // default
  }

  const clickDab = (e, tile) => {
    const xPos = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2;
    const yPos = e.currentTarget.offsetTop + e.currentTarget.offsetHeight + 12; // 12 = the arrow height
    onClick(tile, { x: xPos, y: yPos });
  };

  return (
    <span id={tile.id} className={tileClass} onClick={(e) => clickDab(e, tile)} onMouseOver={(e) => onHover(tile)}>
      <span
        data-id={tile.id}
        className={`overlay group absolute w-full h-full left-0 transition-transform ${
          isSelected && 'border border-white'
        } ${(isInactive || tile.order) && 'bg-black opacity-30 cursor-default'}`}
      >
        {/* {isSelected && <img src={`${FIREBASE_STORAGE_PATH}${tile.tilePath}`} alt={tile.order} className="w-full h-full" /> } */}
      </span>
    </span>
  );
}

/**
 * FREE pricing tier 1 tiles
 *
 * [642,643,644,645,646,698,699,700,701,702,754,755,756,757,758,810,811,812,813,814,866,867,868,869,870,922,923,924,925,926,978,979,980,981,982,1034,1035,1036,1037,1038,1090,1091,1092,1093,1094,1146,1147,1148,1149,1150,1202,1203,1204,1205,1206,1258,1259,1260,1261,1262,1314,1315,1316,1317,1318,697,752,807,751,806,862,863,917,973,1029,1028,1085,1084,1141,1140,1196,1195,1251,1250,1306,1362,1361,1305,1417,1416,1418,1419,1307,1308,1363,1364,1030,1031,1032,1033,1086,1087,1088,1089,1142,1143,1144,1145,1197,1198,1199,1200,1201,1252,1253,1254,1255,1256,1257,753,808,809,864,865,919,920,921,975,976,977,918,974,1309,1310,1311,1365,1366,1367,1312,1313,1420,1421,703,760,817,873,929,985,983,984,986,1039,1040,1041,1042,1095,1096,1097,1098,1151,1152,1153,1154,1207,1208,1209,1210,1263,1264,1265,1266,759,815,816,871,872,927,928,704,761,1319,1320]
 *
 */
