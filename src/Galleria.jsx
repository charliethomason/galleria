import React, { useEffect, useState } from "react";
import photos from "./photos";

export default function Galleria() {
  const [actualRowWidth, setActualRowWidth] = useState(0);
  const [lightImg, setLightImg] = useState(null);

  const imgHeight = 600;
  const maxRowWidth = 2400;
  const breakpoints = {
    full: 2400,
    jumbo: 2000,
    xlarge: 1400,
    large: 1000,
    medium: 600,
    small: 320
  };

  useEffect(() => {
    let timeoutId;
    window.addEventListener('keydown', e => {
      if (e.key === "Escape") {
        closeLightbox(e);
      }
    });
    window.addEventListener('resize', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onResize, 500);
    });
    onResize();
    loadImages();
  });

  function loadImages() {
    const allRows = document.querySelectorAll(".galleria__row");
    allRows.forEach(row => {
      const rowImgs = row.querySelectorAll(".galleria__img");
      rowImgs.forEach(img => {
        const small = img.children[0];

        let imgSmall = new Image();
        imgSmall.src = small.src;
        imgSmall.onload = () => {
          small.classList.add("loaded");
        };

        let imgLarge = new Image();
        imgLarge.src = img.dataset.large;
        imgLarge.alt = small.alt;
        imgLarge.onload = () => {
          // give the link a class of "ready"
          // to indicate lightbox clicks can now happen
          img.classList.add("ready");
          imgLarge.classList.add("loaded");
        };
        img.appendChild(imgLarge);
      });
    });
  }

  function getTotalWidth(row) {
    return row.reduce((sum, r) => {
      return sum + r.width;
    }, 0);
  }

  function getStyle(row, img) {
    const onlyOneInRow = row.length === 1;
    const totalWidth = getTotalWidth(row);
    // if the image is in a row by itself,
    // and its width is less than the actual displayed row width,
    // then its height should just be its normal height,
    // otherwise calculate the height as follows:
    // actual displayed row width, divided by the aspect ratio of the row.
    // e.g.: 1000 / (2400 / 600 = 4) = 250
    const rowHeight = onlyOneInRow && img.width <= actualRowWidth
      ? imgHeight
      : actualRowWidth / (totalWidth / imgHeight);
    // if the image is in a row by itself,
    // and its width is less than the actual displayed row width,
    // then its width should also be its normal width,
    // otherwise reduce the image width by the same amount the image height was reduced
    // i.e.: actual width, divided by (actual height divided by displayed height).
    // e.g.: 800 / (600 / 250 = 2.4) = 320
    const imgWidth = onlyOneInRow && img.width <= actualRowWidth
      ? img.width
      : img.width / (imgHeight / rowHeight)
    return {
      height: rowHeight,
      width: imgWidth
    };
  }

  function onResize() {
    const {
      small,
      medium,
      large,
      xlarge,
      jumbo,
      full
    } = breakpoints;
    const windowWidth = window.innerWidth;
    // if viewport is larger than max possible row size, use full row width
    if (windowWidth > full) {
      setActualRowWidth(full);
    // if viewport is between jumbo and full, use jumbo row width
    } else if (windowWidth > jumbo && windowWidth < full) {
      setActualRowWidth(jumbo);
    // if viewport is between xlarge and jumbo, use xlarge row width
    } else if (windowWidth > xlarge && windowWidth < jumbo) {
      setActualRowWidth(xlarge);
    // if viewport is between large and xlarge, use large row width
    } else if (windowWidth > large && windowWidth < xlarge) {
      setActualRowWidth(large);
    // if viewport is between medium and large, use medium row width
    } else if (windowWidth > medium && windowWidth < large) {
      setActualRowWidth(medium);
    // if viewport is less than medium, use small row width
    } else {
      setActualRowWidth(small);
    }
  }

  function onClick(e, img) {
    e.preventDefault();
    e.stopPropagation();
    // don't let lightbox happen before images have loaded
    if (e.target.classList.contains("ready")) {
      setLightImg(img);
    }
  }

  function closeLightbox(e) {
    e.preventDefault();
    e.stopPropagation();
    setLightImg(null);
  }

  function lightboxNav(e, change) {
    e.stopPropagation();
    const currentIndex = photos.findIndex(img => img.file === lightImg.file);
    const lastImgIndex = photos.length - 1;
    // if it's the first photo and they clicked previous
    if (currentIndex === 0 && change === -1) {
      setLightImg(photos[lastImgIndex]);
    // if it's the last photo and they clicked next
    } else if (currentIndex === lastImgIndex && change === 1) {
      setLightImg(photos[0]);
    } else {
      setLightImg(photos[currentIndex + change]);
    }
  }

  function renderGalleria() {
    const photosInRows = photos.reduce((rows, img) => { 
      // if we have no rows created yet, create a row with this 1st image
      if (!rows.length) {
        rows.push([img]);
        return rows;
      } else {
        // loop through all the rows we have created so far
        for (const [i, row] of rows.entries()) {
          const currWidths = getTotalWidth(row);
          const isLastRow = i === rows.length-1;
          // "If the currrent total width of the images in this row is
          // greater than/equal to the max width allowed for a single row."
          // All images are 600px in height and the max row width is 2400px.
          // 2400 / 600 = 4, thus a 4:1 min aspect ratio for each row.
          if (currWidths >= maxRowWidth) {
            // if this is the last row we've created so far and it's already full,
            // then create a new row with this image,
            // otherwise continue on to check if the next row has space.
            if (isLastRow) {
              rows.push([img]);
              break;
            } else {
              continue;
            }
          // if there is still space in this row, add this image.
          } else {
            row.push(img);
            break;
          }
        }
        return rows;
      }
    }, []);

    const galleria = photosInRows.map((row, r) => {
      return (
        <div key={`row-${r}`} className="galleria__row">
          {row.map(img => {
            const file = require(`./img/photos/${img.file}.jpg`);
            return (
              <a
                href="#"
                key={`galleria__img--${img.file}`}
                className="galleria__img"
                style={getStyle(row, img)}
                data-large={file}
                onClick={e => onClick(e, img)}
              >
                <img
                  src={file}
                  alt={img.title || img.file}
                  className="galleria__small"
                />
              </a>
            );
          })}
        </div>
      );
    });
    return galleria;
  }

  return (
    <div className="galleria" onClick={closeLightbox}>
      {renderGalleria()}
      {lightImg && lightImg.file && (
        <div className="galleria__lightbox" >
          <img
            src={require(`./img/photos/${lightImg.file}.jpg`)}
            alt={lightImg.file}
            className="galleria__lightbox__img"
          />
          {lightImg.title && (
            <div className="galleria__lightbox__title">{lightImg.title}</div>
          )}
          <button
            type="button"
            className="galleria__lightbox__nav"
            title="Previous"
            onClick={e => lightboxNav(e, -1)}
          >
            <span className="sr-only">Previous</span>
            &larr;
          </button>
          <button
            type="button"
            className="galleria__lightbox__nav"
            title="Next"
            onClick={e => lightboxNav(e, 1)}
          >
            <span className="sr-only">Next</span>
            &rarr;
          </button>
          <button
            type="button"
            className="galleria__lightbox__close"
            onClick={closeLightbox}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
