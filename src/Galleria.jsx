import React, { useEffect, useState } from "react";
import photos from "./photos";

export default function Galleria() {
  const [actualRowWidth, setActualRowWidth] = useState(0);
  const [lightImg, setLightImg] = useState(null);

  const imgHeight = 600;
  const maxRowWidth = 2400;
  const breakpoints = {
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
    // actual displayed row width, divided by the aspect ratio of the row.
    // e.g.: 1000 / (2400 / 600 = 4) = 250
    const rowHeight = onlyOneInRow && img.width <= actualRowWidth
      ? imgHeight
      : actualRowWidth / (totalWidth / imgHeight);
    // reduce the image width by the same amount the image height was reduced
    const imgWidth = onlyOneInRow && img.width <= actualRowWidth
      ? img.width
      : img.width / (imgHeight / rowHeight)
    return {
      height: rowHeight,
      width: imgWidth
    };
  }

  function onResize() {
    const { small, medium, large } = breakpoints;
    const windowWidth = window.innerWidth;
    if (windowWidth > medium && windowWidth < large) {
      setActualRowWidth(medium);
    } else if (windowWidth >= small && windowWidth < medium) {
      setActualRowWidth(small);
    } else {
      setActualRowWidth(large);
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
          // If the image heights are 600px then the max possible row width is 2400px.
          // 2400 / 600 = 4, thus a 4:1 min aspect ratio for each row.
          if (currWidths >= maxRowWidth) {
            // if this is the last row and it's already full, create a new one with this image.
            // otherwise continue on to check the next row.
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
          {row.map(img => (
            <a
              href="#"
              key={`galleria__img--${img.file}`}
              className="galleria__img"
              style={getStyle(row, img)}
              data-large={require(`./img/photos/${img.file}.jpg`).default}
              onClick={e => onClick(e, img)}
            >
              <img
                src={require(`./img/photos/thumbs/${img.file}.jpg`).default}
                alt={img.title || img.file}
                className="galleria__small"
              />
            </a>
          ))}
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
            src={require(`./img/photos/${lightImg.file}.jpg`).default}
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
