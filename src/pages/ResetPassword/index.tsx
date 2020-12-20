import React, {useRef, useCallback} from 'react';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/AuthContext'
import {useToast} from '../../hooks/ToastContext'
import {Link, useHistory, useLocation} from 'react-router-dom';


import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {Container, Content, AnimationContainer, Background} from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();
    /*chama a função que contem o Hook para utilizar o contexto que o signin esta inserido,
    definido dentro do app;
    Assim é permitido usar a função signin, capturando o nome e senha do usuario*/

    const history = useHistory();
    const location = useLocation();

     /*Função para manipular os dados enviados do formulario, usando modulo callback*/ 
     const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try{

            formRef.current?.setErrors({});

            /*Faz a confirmação de senha, mostrano o icone caso as senhas nao sejam iguais */
            const schema = Yup.object().shape({ /*validar o objeto data inteiro qie vai ter o 
                formato shape */
                password: Yup.string().required('Senha obrigatória'),
                password_confirmation: Yup.string().oneOf(
                    [Yup.ref('password'), undefined],
                    'As senhas não correspondem.'
                ),
            }); 

            await schema.validate(data, {
                abortEarly: false //para nao abortat quando pegar o primeiro erro
            }); //assincrono para verificar se o data é válido        
            
            const {password, password_confirmation} = data;
            const token = location.search.replace('?token=', ''); /*O location retorna um objeto
            que contem um campo search, com a url com o token. O replace é para tirar essa
            expressão e ficar apenas com o token*/

            if(!token) {throw new Error();}

            await api.post('/password/reset', {
                password,
                password_confirmation,
                token
            })

            history.push('/');

        } catch(err){
            /*Se for um erro de validação gerado pelo Yup*/
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err); //passa o erro para a função criada
                formRef.current?.setErrors(errors); /*interrogação para verificar se a variavel existe 
                seta os erros no formulario, é criado pelo getvalidationerrors do tipo especifico*/

                return;
             }
             addToast({
                 type: 'error',
                 title: 'Erro ao resetar a senha',
                 description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
             });
        }
    }, [addToast, history, location.search]) //variavel externa precisa ser declarada como segundo parametro;

    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt="GoBarber"/>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Resetar senha</h1>

                    <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                    <Input name="password_confirmation" icon={FiLock} 
                        type="password" placeholder="Confirmação da senha" />
                    <Button type="submit">Alterar senha</Button>
                </Form>

            </AnimationContainer>
        </Content>
        <Background/>
    </Container>
);
}

export default ResetPassword;