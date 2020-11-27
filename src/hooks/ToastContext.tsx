import React, {createContext, useCallback, useContext, useState} from 'react';
import ToastContainer from '../components/ToastContainer';
import { v4 as uuidv4 } from 'uuid';

export interface ToastMessage{
    id: string;
    type?: 'success' | 'error' | 'info'; /*default é info, caso nao tenha*/
    title: string;
    description?: string;
}

interface ToastContextData{
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({children}) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(
        /*Omit o atributo id e seleciona apenas os outros*/
        ({type, title, description}: Omit<ToastMessage, 'id'> ) => {
            const id = uuidv4();
            const toast = {
                id,
                type,
                title,
                description
            };

        setMessages((state) => [...state, toast]); /*QUando passa uma função ele recebe um valor
        antigo e adiciona o valor novo desejado*/
        }, []
    );


    const removeToast = useCallback((id:string)=>{
        /*pega o estado atual através de uma função
        retorna as mensagens filtrada em que o id é diferente da recebida*/
        setMessages((state) => state.filter((message)=>message.id !== id));
    }, [])

    return (
        <ToastContext.Provider value={{addToast, removeToast}}>
            {children}
            <ToastContainer messages={messages}/> {/*Passa as mensagens toast para o toastcontainer*/}
        </ToastContext.Provider>
    );
};

/*Permite a utilização do toast como contexto fora do componente*/
function useToast(): ToastContextData{
    const context = useContext(ToastContext);

    if(!context) throw new Error('useToast deve ser usado dentro de um ToastProvider');

    return context;
}

export {ToastProvider, useToast};