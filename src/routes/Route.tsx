import React from 'react';
import {
    Route as ReactDOMROute,
    RouteProps as ReactDOMROuteProps, //contem diversas propriedades, como path, render, location
    Redirect
} from 'react-router-dom';

import {useAuth} from '../hooks/AuthContext'

interface RouteProps extends ReactDOMROuteProps{
    isPrivate?: boolean;
    component: React.ComponentType; /*Sobrescrita do método, para receber no formato {} */
}
/* 
rota privada true / usuario autenticado true = OK, deixa ele continuar
true / false = redirecionar pro login
false / true = redirecionar pro dashboard
false / false = ok
*/

/*Rota para direcionar o usuario que estiver autenticado para a dashboard privada;
isprivate é true caso a página tenha acesso restrito
Component com C maiusculo para ser mostrado com a tag
*/

const Route: React.FC<RouteProps> = ({isPrivate=false, component:Component, ...rest}) => {
    const {user} =useAuth(); //atraves do contexto pega o login do usuario
    console.log('route', user, !!user, isPrivate)
    return(
        <ReactDOMROute
        {...rest}
        /*Render permite alterar as rotas internas
        location para salvar o estado de uma pagina no historico (permitindo voltar)
        o if é de acordo com o comentario de cima, é privado e o usuario esta autenticado
        caso os dois sejam verdadeiros, retorna o dashboard normal
        Utiliza o modulo redirect para fazer as rotas corretas
        */
        render={( {location} )=>{ 
            return isPrivate === !!user ?(<Component/>) : (<Redirect
            to={{pathname: isPrivate ? '/' : '/dashboard', 
                state:{from:location}
        }}/>)
        }}
        />
    )
}

export default Route;