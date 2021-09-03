import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { Game } from './components/Game';

ReactDOM.render(
  <React.StrictMode>
    <Game squaresPerRow={3} />
  </React.StrictMode>,
  document.getElementById('root')
);