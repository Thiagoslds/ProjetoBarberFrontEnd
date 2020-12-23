/*Como será utilizado várias vezes, melhor isolar o componente formulário*/

import React, {InputHTMLAttributes, useEffect, useRef, useState, useCallback} from 'react';
import {IconBaseProps} from 'react-icons';
import {FiAlertCircle} from 'react-icons/fi';

import {useField} from '@unform/core'

import {Container, Error} from './styles';

/*Utilização da interface herdando de um modulo pronto;
nome se torna obrigatório e icone opcional 
recebe um icone como componente da pagina , por isso o react.component;
o iconbaseprops permite utilizar propriedades dos icones, como o size */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    containerStyle?: object; /*Para pegar o container todo e nao apenas o input dentro*/
    icon?: React.ComponentType<IconBaseProps>;
}

/*Criação do padrao de formulario; utiliza a interface obrigatoriamente como parametragem
Icon com letra maiuscula pois é necessário na tag; operado spread para pegar todas as props do input
Container contem os estilos css 
Icon deve vir antes, com if pois pode conter ou não no formulario*/
const Input: React.FC<InputProps> = ({name, containerStyle= {}, icon: Icon, ...rest}) =>{ 
    const inputRef = useRef<HTMLInputElement>(null); //permite utilizar todos os elementos da DOM
    const {fieldName, defaultValue, error, registerField} = useField(name); /*UseField é um
    hook (permite utilizar state sem classe), pega o nome do campo e retorna varias propriedades;
    */
   const [isFocused, setIsFocused] = useState(false);
   const [isFilled, setIsFilled] = useState(false);

    /*O unform vai em cada um dos inputs criados, registrados, pegou a referencia deles 
    (elemento da dom) e acessou a propriedade value e retornou um campo exato como o fieldname*/


    /*O usecallback para utilizar funções dentro de funções, sendo chamada uma vez para
    não sobrecarregar*/
    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!!inputRef.current?.value); /* semelhante a:
        if(inputRef.current?.value) setIsFilled(true);
            else setIsFilled(false);
        */
    }, []);

    /*assim que o componente é exibido em tela, chama o register field*/
    useEffect(() => {
        registerField({
            name: fieldName, //nao usa o nome pq altera
            ref: inputRef.current, /*referencia pro input (semelhante a utilização de um 
                document.element), o current é um padrão do react*/
            path: 'value' //caminho de onde ele vai buscar o valor do input
        });
    }, [fieldName, registerField]);

    return (
        //passa o estado pro estilizador container
    <Container style={containerStyle} isErrored={!!error} isFilled={isFilled} isFocused={isFocused}> 
        {Icon && <Icon size={20} />}
        <input 
        onFocus={handleInputFocus} /*quando input ganha o foco*/
        onBlur={handleInputBlur} /*quando input perde o foco*/
        defaultValue={defaultValue}
        ref={inputRef} 
        {...rest}/> 

        {error && (
        <Error title={error}>
            <FiAlertCircle color="#c53030" size={20}/>
        </Error>)}
    </Container>
);}

export default Input;