import React from 'react';
import ReactDOM from 'react-dom';
import "core-js/stable";
import App from './App.jsx';
import './scss/main.scss';

const wrapper = document.getElementById('app');
ReactDOM.render(<App />, wrapper);