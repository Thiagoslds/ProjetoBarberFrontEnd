import React, {useRef, useCallback} from 'react';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/AuthContext'
import {useToast} from '../../hooks/ToastContext'


import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {Container, Content, Background} from './styles';

interface SignInFormData {
    email: string;
    password: string;
}


const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();
    const {user, signIn} = useAuth();
    /*chama a função que contem o Hook para utilizar o contexto que o signin esta inserido,
    definido dentro do app;
    Assim é permitido usar a função signin, capturando o nome e senha do usuario*/

    console.log(user);

     /*Função para manipular os dados enviados do formulario, usando modulo callback*/ 
     const handleSubmit = useCallback(async (data: SignInFormData) => {
        try{
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({ /*validar o objeto data inteiro qie vai ter o 
                formato shape */
                name: Yup.string().required('Nome Obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória')
            });

            await schema.validate(data, {
                abortEarly: false //para nao abortat quando pegar o primeiro erro
            }); //assincrono para verificar se o data é válido          

            /*envia o email e senha capturados para a função signin, definida no atuhcontext*/
            await signIn({
                email: data.email,
                password: data.password,
            });            

        } catch(err){
            /*Se for um erro de validação gerado pelo Yup*/
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err); //passa o erro para a função criada
                formRef.current?.setErrors(errors); /*interrogação para verificar se a variavel existe 
                seta os erros no formulario, é criado pelo getvalidationerrors do tipo especifico*/
             }
             addToast({
                 type: 'error',
                 title: 'Erro na autenticação',
                 description: 'Ocorreu um erro ao fazer login'
             });
        }
    }, [signIn, addToast]) //variavel externa precisa ser declarada como segundo parametro;

    return (
    <Container>
        <Content>
            <img src={logoImg} alt="GoBarber"/>
            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Faça seu logon</h1>

                <Input name="email" icon={FiMail} placeholder="E-mail" />
                <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                <Button type="submit">Entrar</Button>
            </Form>

            <a href="login">
                <FiLogIn />
                Criar Conta
            </a>
        </Content>
        <Background/>
    </Container>
);
}

export default SignIn;