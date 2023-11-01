import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import '@atlaskit/css-reset';
import { SelectedKeyProvider } from './Componentes/SelectedKeyContext';

ReactDOM.render(
    <React.StrictMode>
        <SelectedKeyProvider>
        <App />
        </SelectedKeyProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
