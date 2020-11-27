import styled, {css} from 'styled-components';
import {animated} from 'react-spring';

interface ContainerProps{
    type ?: 'success' | 'error' | 'info';
    hasdescription: boolean;
}

const toastTypeVariations = {
    info: css `
        background: #ebf8ff;
        color: #3172b7;
     `,
     success: css ` 
        background: #e6fffa;
        color: #2e656a;
     `,
     error: css ` 
        background: #fddede;
        color: #c53030;
     `
};

export const Container = styled(animated.div) <ContainerProps> `
    width: 360px;

    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius: 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /*cor rgb e opacidade 20%*/

    display: flex;

    /*Um toast que antes contenha outro toast */
    & + div {
        margin-top: 8px;
    }

    /*Pega as propriedades que serão passadas no index do toast, e passa o tipo dela (sucesso, erro,
    etc) para a const criada; caso nao tenha o padrão é a info*/ 
    ${(props) => toastTypeVariations[props.type || 'info']}

    > svg{
        margin: 4px 12px 0 0;
    }

    div {
        flex: 1;

        p{
            margin-top: 4px;
            font-size: 14px;
            opacity: 0.8;
            line-height: 20px;
        }
    }

    button {
        position: absolute;
        right: 16px;
        top: 20px;
        opacity: 0.6;
        border: 0;
        background: transparent;
        color: inherit;
    }

    /*Verifica se tem o atributo hasdecription e alinha os itens caso seja falso */
    ${(props) => !props.hasdescription && css ` 
        align-items: center;
        svg{
            margin-top: 0;
        }
    `

    }
`;