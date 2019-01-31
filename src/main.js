import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import App from './App.js';

axios.defaults.baseURL = __SERVER_BASE_URL__;


ReactDOM.render(<App />, document.getElementById('app'));