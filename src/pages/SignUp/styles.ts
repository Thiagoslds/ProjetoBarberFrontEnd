import styled, {keyframes} from 'styled-components';
import {shade} from 'polished';

import signUpImg from '../../assets/sign-up-background.png'

export const Container = styled.div ` 
    height: 100vh; /*viewheight, tamanho total do visor */
    display: flex;
    align-items: stretch; /*estica o maximo cada item para ocupar todo espaço*/
`;

export const Content = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    place-content: center;

    width: 100%;
    max-width: 700px;   
`;

const appearFromRight = keyframes ` 
    from {
        opacity: 0;
        transform: translateX(50px); /*Aparece a 50% do espaço, vindo da esquerda*/
    }
    to {
        opacity: 1;
        transform: translateX(0); 
    }
`;
export const AnimationContainer = styled.div ` 
    display: flex;
    flex-direction: column;
    align-items: center;
    place-content: center;

    animation: ${appearFromRight} 1s;
     
    form{
        margin: 60px 0;
        width: 340px;
        text-align: center;

        h1{
            margin-bottom: 24px;
        }

        a{
            color: #f4ede8;
            display: block;
            margin-top: 24px;
            text-decoration: none;
            transition: color 0.2s;

            &:hover{
                color: ${shade(0.2, '#f4ede8')};
            }
        }
    }

    /*Pega os elementos que sã */
    >a{
        color: #f4ede8;
        display: block;
        margin-top: 8px;
        text-decoration: none;
        transition: color 0.2s;

        display: flex;
        align-items: center;

        svg{
            margin-right: 16px;
        }

        &:hover{
            color: ${shade(0.2, '#ff9000')};
        }
        

    }
`;

export const Background = styled.div `
    flex: 1;
    background: url(${signUpImg}) no-repeat center;
    background-size: cover;
`;