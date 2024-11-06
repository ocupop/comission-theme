import React from 'react';
import { format, parseISO } from 'date-fns';
import ImageCrosshairs from './ImageCrosshairs.jsx';

export default function Certificate(props) {
  const position = parseInt(props.position);
  const product = JSON.parse(decodeURIComponent(props.product));
  const metafields = props.productmetafields ? JSON.parse(decodeURIComponent(props.productmetafields)) : {};
  const artist = props.artist ? JSON.parse(decodeURIComponent(props.artist)) : {};
  const museum = props.museum ? JSON.parse(decodeURIComponent(props.museum)) : {};
  const location = props.location ? decodeURIComponent(props.location) : null;
  console.log('location,', location);
  const { featured_image, media, title } = product;
  const { rows, cols, year, medium, startDate, endDate, note } = metafields;

  const tile =
    !props.tilepath || !props.collector ? metafields?.tiles?.find((tile) => tile.position === position) : null;

  // tilePath and collector are passed in from props. If props do not exist, extract from product metafields based on the position.
  // (This allows us to generate an image BEFORE metafields are updated to include this data)
  const tilePath = props.tilepath
    ? `https://storage.googleapis.com/comission-application.appspot.com/${props.tilepath}`
    : tile?.tilePath;
  const collector = props.collector
    ? decodeURIComponent(props.collector)
    : tile?.order?.customer
    ? tile.order.customer.firstname + ' ' + tile.order.customer.lastname
    : null;

  console.log('collector:: ', collector);
  console.log('tilePath:: ', tilePath);

  const dabDetails = [
    { label: 'DAB #', value: position ? position : null },
    {
      label: 'Collector',
      value: collector,
    },
    {
      label: 'Membership Active',
      value:
        startDate && endDate
          ? format(parseISO(startDate), 'MM/dd/yyyy') + ' - ' + format(parseISO(endDate), 'MM/dd/yyyy')
          : null,
    },

    { label: 'Artist', value: artist?.title },
    { label: 'Year', value: year },
    { label: 'Medium', value: medium },
    { label: 'On View', value: museum?.title },
    { label: 'Location', value: location },
    {
      label: museum?.title,
      img: museum?.image.src,
      value: note ? <div className="value max-w-[15em]">{note}</div> : null,
    },
  ];
  return (
    <div className="restrict-height pb-[77%] w-screen relative h-0 overflow-hidden ">
      <div
        className="flex flex-col certificate absolute h-full w-full text-[1vw] pt-[4em] pr-[4.5em] pb-[4em] pl-[4.5em]"
        id="certificate"
      >
        <header className="pb-[2.2em] mb-[2.9em] border-b border-b-black flex items-center justify-between">
          <img
            src="/cdn/shop/files/comission-color-logo-nav_61503bee-b993-4e65-a093-1eaaa196760c.png?v=1719357016&amp;width=600"
            alt="CoMission Art"
            width="300"
            loading="eager"
            className="max-w-full logo w-[26.3em] h-auto"
          />
          <h1 className="font-bold mb-0 text-[3em] mt-[0.1em] leading-[1.5] tracking-wider">
            Certificate of Authenticity
          </h1>
        </header>

        <main className="flex flex-1">
          <div className="leftcol pr-[4em] pl-[0.7em] border-r-black border-r w-[57%]">
            <h2 className="font-bold title mb-0 text-[2.5em] tracking-wider leading-[1.5]">{title}</h2>
            {artist && (
              <h3 className="artist text-[1.9em] leading-[1.5]">
                <a href={`collections/${artist.handle}`}>{artist.title}</a>
              </h3>
            )}
            <div className="relative w-full mt-[2em]" id="crosshairs">
              <img className="w-full" src={featured_image} alt={media[0].alt} />
              {rows && cols && position && (
                <ImageCrosshairs animate={false} cols={cols} rows={rows} position={position} />
              )}
            </div>
          </div>

          <div className="flex flex-col rightcol pl-[4em] pt-[2.1em] w-[43%]">
            <div className="dab-image">
              {tilePath ? (
                <div className="col-span-2 lg:col-span-3">
                  <img src={tilePath} className="tile-image h-[17em] w-auto" id="DAB" alt="DAB" />
                </div>
              ) : (
                <div className="p-5 border">
                  <h3 className="m-0">Tile image not yet available</h3>
                </div>
              )}
            </div>

            <ul className="flex flex-col justify-between flex-1 list-none attributes-list mt-[2.6em]">
              {/* Dab # */}

              {dabDetails
                .filter((item) => item.value)
                .map((item) => (
                  <li key={item.label}>
                    <label className="uppercase text-[#171717] mr-[1em] w-[30%]">
                      {item.img ? <img src={item.img} alt={item.label} /> : item.label}
                    </label>
                    <div className="value w-[70%] text-[1.3em] font-semibold tracking-wider">{item.value}</div>
                  </li>
                ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  ); // END .certificate;
}
