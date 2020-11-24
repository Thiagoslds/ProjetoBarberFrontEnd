import styled, {css} from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps{
    isFocused:  boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps> ` 
   
            background: #232129;
            border-radius: 10px;
            border: 2px solid #232129;
            padding: 16px;
            width: 100%;
            color: #666360;

            display: flex;
            align-items: center;

            & + div {
                margin-top: 8px;
            }

            /*Borda vermelha em caso de erro */
            ${(props) =>
                props.isErrored &&
                css ` 
                    border-color: #c53030;
            ` }

            /*caso tenha mudança no input, coloca borda no campo ativo*/
            ${(props)=>
            props.isFocused &&
            css ` 
                color: #ff9000;
                border-color: #ff9000;
            `}

            /*Deixa o icone laranja caso tenha conteudo no input */
            ${(props)=>
            props.isFilled &&
            css ` 
                color: #ff9000;
            `}

            input {
                flex: 1;
                background: transparent;
                border: 0;
                color: #f4ede8;

            &::placeholder{
                color: #686030
            }
            
        }

        svg {
            margin-right: 16px;
        }
`;

/*Aplica as mudanças no container do tooltip  */
export const Error = styled(Tooltip) ` 
    height: 20px; /*corrige a altura da borda*/
    margin-left: 16px; /*não deixa o texto encostar no icone */

    svg{
        margin: 0;
    }

    span{
        background: #c53030;
        color: #fff;

        &::before{
            border-color: #c53030 transparent;
        }
    }
`;