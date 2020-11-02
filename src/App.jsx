import React, { Component } from 'react';

export default class App extends Component {
  render() {
    const images = require.context('./img/photos', false);
    return (
      <main>
        <h1>Photo Gallery</h1>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "1000px", margin: "0 auto" }}>
          {images.keys().map((img, i) => {
            return (
              <div key={img} style={{ flex: "0 1 auto", height: "200px" }}>
                <a href="#" style={{ display: "block", height: "100%" }}>
                  <img
                    src={`./img/photos/${img}`}
                    alt={img}
                    style={{ dipslay: "block", height: "100%", maxWidth: "100%" }}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </main>
    );
  }
};
