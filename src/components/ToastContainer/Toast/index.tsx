/*Componente específico para criação do toast*/

import React, { useEffect } from 'react';
import {ToastMessage, useToast} from '../../../hooks/ToastContext';
import {FiAlertCircle, FiXCircle, FiInfo, FiCheckCircle} from 'react-icons/fi';

import {Container} from './styles';

interface ToastProps{
    message: ToastMessage;
    style: object;
}

/*Icones para aparecer no toast*/
const icons = {
    info: <FiInfo size={24}/>,
    error: <FiAlertCircle size={24}/>,
    success: <FiCheckCircle size={24}/>
}

const Toast: React.FC<ToastProps> = ({message, style}) => {
    const {removeToast} = useToast();

    /*Permite que o toast desapareça sozinho depois de 5s. Caso tenha sido removido com um clique
    ele é encerrado. UseEffect quando é retornado uma função, ela é exceutada caso o atributo passado
    não exista mais*/
    useEffect(()=>{
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 5000);
        return () => {
            clearTimeout(timer);
        }
    }, [removeToast, message.id]);

    return(
        <Container type={message.type} 
        hasdescription={Number(!!message.description)}
        style={style} /*Recebe a animação criada*/
        >
               {icons[message.type || 'info'] /*Mostra o icone ou o padrão info*/} 
 
                <div>
                    <strong>{message.title}</strong>
                    {message.description && <p>{message.description}</p>}
                </div>
                {/*Ao clicar no botao x ele remove o toast */}
                <button onClick={() => removeToast(message.id)} type="button">
                    <FiXCircle size={18}/>
                </button>
        </Container>
    );
}

export default Toast;