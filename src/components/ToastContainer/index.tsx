/*Componente Toast para mostrar mensagens Toast, alertas gerais */

import React from 'react';
import {Container} from './styles';
import {ToastMessage} from '../../hooks/ToastContext';
import Toast from './Toast';
import {useTransition} from 'react-spring'; /*Permite utilizar animações*/

interface ToastContainerProps{
    messages: ToastMessage[]; //utiliza a interface do toastcontext
}

/*Recebe as mensagens do hook toast e atraves de um map mostra os dados de cada mensagem 
na tela*/
const ToastContainer: React.FC<ToastContainerProps> = ({messages}) => {

    /*Para usar o transitions, como primeiro argumento utiliza as mensagens e 
    o segundo uma função, passando o id e os parametros desejados*/
    const messagesWithTransitions = useTransition(
    messages,
    (message) => message.id,
    {
        from: {right: '-120%', opacity:0}, /*onde começa ---- transform: 'rotateZ(0deg)' */
        enter: {right: '0%', opacity:1}, /*quando entra ---- transform: 'rotateZ(0deg)' */
        leave: {right: '-120%', opacity:0} /* quando sai ---- transform: 'rotateZ(0deg)' */
    }
    );
    return( 
    <Container>
        
        {messagesWithTransitions.map(({item, key, props})=>( /*props contem a estilização, 
        o item é a mensagem completa*/
        <Toast 
            key={key}
            style={props}
            message={item}
        />
        ))} 
    </Container>
    );
};

export default ToastContainer;