import React, {useCallback, useRef, ChangeEvent} from 'react';
import {FiArrowLeft, FiUser, FiMail, FiLock, FiCamera} from 'react-icons/fi';
import {Form} from '@unform/web' //criado pela rocketseat para manipular eventos
import * as Yup from 'yup'; //modulo para capturar e manipular erros
import getValidationErrors from '../../utils/getValidationErrors';
import {Link, useHistory} from 'react-router-dom';
import api from '../../services/api';
import {useToast} from '../../hooks/ToastContext'

import Button from '../../components/Button';
import Input from '../../components/Input';

import {Container, Content, AvatarInput } from './styles';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileFormData{
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null); /*useref para acessar os valores do formulario, para 
    manipular o erro, setar, limpar, etc 
    Para ter acesso depois com a constante formref, usa o formhandles do modulo unform rocketseat*/
    const{addToast} = useToast();
    const history = useHistory(); 
    const {user, updateUser} = useAuth();

    /*Função para manipular os dados enviados do formulario, usando modulo callback, que serve
    para utilizar funções dentro de funções, sendo chamada uma vez para não sobrecarregar;
    o segundo parametro é uma variavel que setada e modificada altera a função*/ 
    const handleSubmit = useCallback(async (data: ProfileFormData) => {
        try{
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({ /*validar o objeto data inteiro que vai ter o 
                formato shape a ser definido */
                name: Yup.string().required('Nome Obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                old_password: Yup.string(),
                /*Se tiver senha no campo atual, deve ser obrigatorio preencher na nova
                e confirmação*/
                password: Yup.string() .when('old_password', {
                    is: val => !!val.length, //se tiver valor
                    then: Yup.string().required('Campo Obrigatório'),
                    otherwise: Yup.string()
                }) ,
                password_confirmation: Yup.string() .when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo Obrigatório'),
                    otherwise: Yup.string()
                })
                .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta')
            });

            await schema.validate(data, {
                abortEarly: false //para nao abortat quando pegar o primeiro erro
            }); //assincrono para verificar se o data é válido

            const{name, email, old_password, password, password_confirmation} = data;
            
            /*Para não enviar a senha caso esteja apenas atualizando o nome*/
            const formData = {
                name, email,
                ...(old_password ? {old_password, password, password_confirmation} : {})
            };

            const response = await api.put('/profile', formData);
            updateUser(response.data);

            history.push('/dashboard'); //Redireciona depois de cadastrado para a pagina inicial

            addToast({
                type: 'success',
                title: 'Perfil atualizado!',
                description: 'Suas informações do perfil foram atualizadas com sucesso!'
            });

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
                 title: 'Erro na atualização',
                 description: 'Ocorreu um erro ao atualizar o perfil, tente novamente.'
            });
        }
    }, [addToast, history, updateUser]);
    
    /*Modifica a foto de avatar do perfil; 
    Usa o changeevent do react caso tenha alguma alteração*/
    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>)=>{
            if(e.target.files){ /*aponta para o arquivo que é feito o upload*/
                const data = new FormData(); /*Permite adicionar o avatar, semelhante ao
                multipart do insomnia*/

                data.append('avatar', e.target.files[0]);

                api.patch('/users/avatar', data).then((response)=>{
                    updateUser(response.data);
                    addToast({
                        type: 'success',
                        title: 'Avatar atualizado!'
                    })
                })
            }
        }, [addToast, updateUser]
    );
     
    return (
    <Container>
        <header>
            <div>
                <Link to="/dashboard">
                    <FiArrowLeft />
                </Link> 
            </div>
        </header>
        <Content>
                <Form ref={formRef} initialData={{ /*mostra os dados do perfil*/
                    name: user.name,
                    email: user.email
                }} onSubmit={handleSubmit}> 
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        {/*label utilizado ao inves do button como hack para clicar
                        no simbolo da camera e poder trocar */}
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" id="avatar" onChange={handleAvatarChange}/>
                        </label>
                    </AvatarInput>
                    
                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input containerStyle={{marginTop: 24}} name="old_password" icon={FiLock} 
                        type="password" placeholder="Senha atual" />
                    <Input name="password" icon={FiLock} 
                        type="password" placeholder="Nova Senha" />
                    <Input name="password_confirmation" icon={FiLock} 
                        type="password" placeholder="Confirmar Senha" />
                    <Button type="submit">Confirmar mudanças</Button>
                </Form>
        </Content>

        
    </Container>

    );}

export default Profile ;