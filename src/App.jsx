import React, { Component } from 'react';
import Galleria from "./Galleria.jsx";

export default class App extends Component {
  render() {
    return (
      <main className="wrapper">
        <h1>Photo Gallery</h1>
        <Galleria />
      </main>
    );
  }
};
