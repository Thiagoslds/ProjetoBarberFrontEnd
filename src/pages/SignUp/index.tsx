import React, {useCallback, useRef} from 'react';
import {FiArrowLeft, FiUser, FiMail, FiLock} from 'react-icons/fi';
import {Form} from '@unform/web' //criado pela rocketseat para manipular eventos
import * as Yup from 'yup'; //modulo para capturar e manipular erros
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {Container, Content, Background} from './styles';
import { FormHandles } from '@unform/core';


const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null); /*useref para acessar os valores do formulario, para 
    manipular o erro, setar, limpar, etc 
    Para ter acesso depois com a constante formref, usa o formhandles do modulo unform rocketseat*/

    /*Função para manipular os dados enviados do formulario, usando modulo callback, que serve
    para utilizar funções dentro de funções, sendo chamada uma vez para não sobrecarregar;
    o segundo parametro é uma variavel que setada e modificada altera a função*/ 
    const handleSubmit = useCallback(async (data: object) => {
        try{
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({ /*validar o objeto data inteiro que vai ter o 
                formato shape a ser definido */
                name: Yup.string().required('Nome Obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            });

            await schema.validate(data, {
                abortEarly: false //para nao abortat quando pegar o primeiro erro
            }); //assincrono para verificar se o data é válido
        } catch(err){
            const errors = getValidationErrors(err); //passa o erro para a função criada
            formRef.current?.setErrors(errors); /*interrogação para verificar se a variavel existe 
            seta os erros no formulario, é criado pelo getvalidationerrors do tipo especifico*/
             
        }
    }, []);
    
    
    return (
    <Container>
        <Background/>

        <Content>
            <img src={logoImg} alt="GoBarber"/>
            <Form ref={formRef} onSubmit={handleSubmit}> 
                <h1>Faça seu cadastro</h1>

                <Input name="name" icon={FiUser} placeholder="Nome" />
                <Input name="email" icon={FiMail} placeholder="E-mail" />
                <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                <Button type="submit">Entrar</Button>
            </Form>

            <a href="login">
                <FiArrowLeft />
                Voltar para logon
            </a>
        </Content>

        
    </Container>

    );}

export default SignUp ;