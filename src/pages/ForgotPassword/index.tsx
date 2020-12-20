import React, {useRef, useCallback, useState} from 'react';
import {FiLogIn, FiMail} from 'react-icons/fi';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {useToast} from '../../hooks/ToastContext'
import {Link, useHistory} from 'react-router-dom';


import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {Container, Content, AnimationContainer, Background} from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();
    /*chama a função que contem o Hook para utilizar o contexto que o signin esta inserido,
    definido dentro do app;
    Assim é permitido usar a função signin, capturando o nome e senha do usuario*/

     /*Função para manipular os dados enviados do formulario, usando modulo callback*/ 
     const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try{
            setLoading(true);
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({ /*validar o objeto data inteiro qie vai ter o 
                formato shape */
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
            });

            await schema.validate(data, {
                abortEarly: false //para nao abortat quando pegar o primeiro erro
            }); //assincrono para verificar se o data é válido       
            
            await api.post('/password/forgot', {
                email: data.email
            });

            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description:
                'Enviamos um e-mail para confirmar a recuperação de senha, por favor verifique sua caixa de entrada'
            })

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
                 title: 'Erro na recuperação de senha',
                 description: 'Ocorreu um erro ao tentar realizar a recuperação de senha.'
             });
        } finally{
            setLoading(false); /*após terminar tudo, seja sucesso ou falha, muda o estado.
            Corresponde ao botão de loading, que deve ser mostrado enquanto a requisição
            está processando*/
        }

    }, [addToast]) //variavel externa precisa ser declarada como segundo parametro;

    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt="GoBarber"/>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Recuperar senha</h1>

                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Button loading={loading} type="submit">Recuperar</Button>
                </Form>

                <Link to="/signin"> 
                    <FiLogIn />
                    Voltar ao Login
                </Link>
            </AnimationContainer>
        </Content>
        <Background/>
    </Container>
);
}

export default ForgotPassword;