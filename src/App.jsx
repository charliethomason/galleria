import React, { Component } from 'react';
import photos from "./photos";

export default class App extends Component {
  renderGalleria() {
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
          {row.map((img, i) => {
            const imgStyle = {
              display: "inline-block",
              height: rowHeight,
              width: img.width / (imgHeight / rowHeight)
            };
            return (
              <a href="#" key={`img-${i}`} className="galleria-img" style={imgStyle}>
                <img src={`./img/photos/${img.file}.jpg`} />
              </a>
            );
          })}
        </div>
      );
    });
    return galleria;
  }

  render() {
    return (
      <main className="wrapper">
        <h1>Photo Gallery</h1>
        <div className="galleria">
          {this.renderGalleria()}
        </div>
      </main>
    );
  }
};
