import {ValidationError} from 'yup';

/*interfac generica, nao sendo necessario criar uma para o nome, outra para email, etc*/
interface Errors{
    [keyA: string]: string;
}

/*Recebe o erro completo, do tipo validationerror do yup, que vem completo, com name, value, path, etc
*/
export default function getValidationErrors(err: ValidationError): Errors{
    const validationErrors: Errors = {}; //cria uma variavel vazia com o tipo da interface errors

    /*dentro do inner, da validationerror, contem os arrays com cada erro, de nome, email, senha.. */
    err.inner.forEach((error) => {
        validationErrors[error.path] = error.message; /*preenche o array com a mensagem (nome 
        obrigatorio) dentro do array na posição do path (name)*/

    })

    return validationErrors;
}