import React, { useEffect, useState } from "react";
import photos from "./photos";

export default function Galleria() {
  const [actualRowWidth, setActualRowWidth] = useState(0);
  const [lightId, setLightId] = useState(null);

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
    const allRows = document.querySelectorAll(".galleria-row");
    allRows.forEach(row => {
      const rowImgs = row.querySelectorAll(".galleria-img");
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
    const rowHeight = onlyOneInRow && img.width <= actualRowWidth
      ? imgHeight
      : actualRowWidth / (totalWidth / imgHeight);
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
    setLightId(img.file);
  }

  function closeLightbox(e) {
    e.preventDefault();
    e.stopPropagation();
    setLightId(null);
  }

  function renderGalleria() {
    const photosInRows = photos.reduce((rows, img) => { 
      if (!rows.length) {
        rows.push([img]);
        return rows;
      } else {
        for (const [i, row] of rows.entries()) {
          const currWidths = getTotalWidth(row);
          const isLastRow = i === rows.length-1;
          if (currWidths >= maxRowWidth) {
            if (isLastRow) {
              rows.push([img]);
              break;
            } else {
              continue;
            }
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
        <div key={`row-${r}`} className="galleria-row">
          {row.map(img => (
            <a
              href="#"
              key={`galleria-img--${img.file}`}
              id={`galleria-img--${img.file}`}
              className="galleria-img"
              style={getStyle(row, img)}
              data-large={require(`./img/photos/${img.file}.jpg`).default}
              onClick={e => onClick(e, img)}
            >
              <img
                src={require(`./img/photos/thumbs/${img.file}.jpg`).default}
                alt={img.file}
                className="galleria-small"
              />
            </a>
          ))}
        </div>
      );
    });
    return galleria;
  }

  return (
    <div className="galleria">
      {renderGalleria()}
      {lightId && (
        <div className="galleria__lightbox" onClick={closeLightbox}>
          <img
            src={require(`./img/photos/${lightId}.jpg`).default}
            alt={lightId}
            className="galleria__lightbox__img"
          />
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
