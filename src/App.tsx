import React from 'react';
import GlobalStyle from './styles/global'
import {BrowserRouter as Router} from 'react-router-dom';
import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
    <Router>
        <AppProvider> {/*AuthPRovider é um componente criado, permitindo utilizar o contexto */}
            <Routes/>
        </AppProvider>
        
        <GlobalStyle />
    </Router>
)

export default App;
