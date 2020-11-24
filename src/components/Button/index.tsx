import React, {ButtonHTMLAttributes} from 'react';
import {Container} from './styles'

/*interface simplificada com type, já que a interface iria ficar vazia,
 atribuindo modulo proprio do react para botao*/
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/*utilização do modulo container com os estilos css 
necessario explicitar o tipo button, mesmo
children para mostrar na tela o valor do filho que vai herdar*/
const Button: React.FC<ButtonProps> = ({children, ...rest}) => (
    <Container {...rest} >
        {children}
        </Container>
);

export default Button;