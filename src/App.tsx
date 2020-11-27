import React from 'react';
import GlobalStyle from './styles/global'
import SignIn from './pages/SignIn'

import AppProvider from './hooks';

const App: React.FC = () => (
    <>
        <AppProvider> {/*AuthPRovider é um componente criado, permitindo utilizar o contexto */}
            <SignIn/>
        </AppProvider>
        
        <GlobalStyle />
    </>
)

export default App;
