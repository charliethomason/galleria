import React, { useEffect } from "react";
import photos from "./photos";

export default function Galleria() {
  useEffect(() => {
    loadImages();
  });

  function loadImages() {
    const allRows = document.querySelectorAll(".galleria-row");
    allRows.forEach(row => {
      const rowImgs = row.querySelectorAll(".galleria-img");
      rowImgs.forEach(img => {
        const small = img.querySelector(".galleria-small");

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

  function renderGalleria() {
    function getTotalWidth(row) {
      return row.reduce((sum, r) => {
        return sum + r.width;
      }, 0);
    }
    const photosInRows = photos.reduce((rows, img) => { 
      if (!rows.length) {
        rows.push([img]);
        return rows;
      } else {
        for (const [i, row] of rows.entries()) {
          const currWidths = getTotalWidth(row);
          const isLastRow = i === rows.length-1;
          if (currWidths >= 2400) {
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
    const imgHeight = 600;
    const rowWidth = 1000;
    const galleria = photosInRows.map((row, r) => {
      const totalWidth = getTotalWidth(row);
      const rowHeight = rowWidth / (totalWidth / imgHeight);
      return (
        <div key={`row-${r}`} className="galleria-row">
          {row.map(img => {
            const imgStyle = {
              height: rowHeight,
              width: img.width / (imgHeight / rowHeight)
            };

            return (
              <a
                href="#"
                key={`galleria-img--${img.file}`}
                id={`galleria-img--${img.file}`}
                className="galleria-img"
                style={imgStyle}
                data-large={require(`./img/photos/${img.file}.jpg`).default}
              >
                <img
                  src={require(`./img/photos/thumbs/${img.file}.jpg`).default}
                  alt={img.file}
                  className="galleria-small"
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
    <div className="galleria">
      {renderGalleria()}
    </div>
  )
}
