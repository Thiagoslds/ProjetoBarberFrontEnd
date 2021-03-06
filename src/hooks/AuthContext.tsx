import React, {createContext, useCallback, useState, useContext} from 'react';
import api from '../services/api'

/*Contextos servem para passar uma informação de um componente para outros acessarem
 de forma global*/

interface User{
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface SignInCredentials {
    email:string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
}

interface AuthState{
    token: string;
    user: User;
}

/*é esperado um valor inicial como parametro */
const AuthContext = createContext<AuthContextData>({} as AuthContextData); 

/*Criação do componente provider
childre: tudo q o componente receber como filho será repassado pro provider*/
const AuthProvider: React.FC = ({children}) => {
    /*Estado para armazenar todos os estados de autenticação 
    Irá iniciar com o valor inicial, caso exista, dos dados de autenticação
    Ira ser aplicada quando acontecer um refresh*/
    const [data, setData] = useState<AuthState>(()=>{
        const token = localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@GoBarber:user');

        if(token && user) {
            /*Coloca o token como padrão no cabeçalho, permitindo utilizar sempre quando dá F5*/
            api.defaults.headers.authorization = `Bearer ${token}`;

            return {token, user: JSON.parse(user)}
        }

        

        return {} as AuthState; //'hack' para nao reclamar de ter objeto vazio
    })

    const signIn = useCallback( async ({email, password}) => {
        /*Envia o email e senha do formulario para a api do node, na rota do post; semelhante ao
        insomnia em sessions */    
        const response = await api.post('sessions', {
            email,
            password
        });
        const {token, user} = response.data;

        /*Salvar as informações obtidas no local storage; prefixo gobarber para identificar*/
        localStorage.setItem('@GoBarber:token', token); 
        localStorage.setItem('@GoBarber:user', JSON.stringify(user)); 

        /*Coloca o token como padrão no cabeçalho, permitindo utilizar sempre quando logado*/
        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({token, user});
        
    }, []);

    /*Faz o logout do usuario*/
    const signOut = useCallback(()=>{
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');

        setData({} as AuthState);
    }, []);

    const updateUser = useCallback((user: User)=>{
        localStorage.setItem('@GoBarber:user', JSON.stringify(user));
        setData({
            token: data.token,
            user
        });
    }, [setData, data.token]);

    return ( 
        /*o provider permite que toda aplicação dentro tenha acesso ao contexto */
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
            {children} 
        </AuthContext.Provider>
    )
};

/*função que permite utilizar o contexto*/
function useAuth(): AuthContextData{
    const context = useContext(AuthContext);

    //caso nao utilize o authprovider por fora da aplicação, dentro do App */
    if(!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')

    return context;
}

export  {useAuth, AuthProvider};