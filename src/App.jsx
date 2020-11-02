import React, { Component } from 'react';

export default class App extends Component {
  render() {
    const images = require.context('./img/photos', false);
    return (
      <main>
        <h1>Photo Gallery</h1>
        {images.keys().map((img, i) => {
          return <img src={`./img/photos/${img}`} alt={img} key={img} style={{ height: "200px" }} />;
        })}
      </main>
    );
  }
};
