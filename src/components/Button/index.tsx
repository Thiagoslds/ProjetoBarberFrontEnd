import React, {ButtonHTMLAttributes} from 'react';
import {Container} from './styles'

/*interface simplificada com type, já que a interface iria ficar vazia,
 atribuindo modulo proprio do react para botao*/
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean; //Status do carregamento
}

/*utilização do modulo container com os estilos css 
necessario explicitar o tipo button, mesmo
children para mostrar na tela o valor do filho que vai herdar
Recebe o status do carregamento, se for verdadeiro mostra "carregando"
*/
const Button: React.FC<ButtonProps> = ({children, loading, ...rest}) => (
    <Container type="button" {...rest} >
        {loading ? 'Carregando...' : children}
        </Container>
);

export default Button;