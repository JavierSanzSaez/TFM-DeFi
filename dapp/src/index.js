import React from 'react';
import ReactDOM from 'react-dom';

import { drizzleReactHooks } from '@drizzle/react-plugin'

import drizzle from "./drizzle";

import './css/index.css';
import App from './components/App';

ReactDOM.render(
    <React.StrictMode>
        <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
            <App/>
        </drizzleReactHooks.DrizzleProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
