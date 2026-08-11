function operacaoPromisse(login, senha) { 
    return new Promise((resolve, reject) => 
        { 
            setTimeout(() => { 
                if(login == "ana" && senha == '123') resolve("Login feito com sucesso!")
                else if(login == "joao" && senha == '1234') resolve("Login feito com sucesso!")
                else if(login == "claudio" && senha == '12345') resolve("Login feito com sucesso!")
                else reject(new Error('Credenciais inválidas!')); 
            }, 2000); 
        }
    );
}

operacaoPromisse('ana', '12343')
    .then(resultado => console.log(resultado))
    .catch(erro => console.error(erro))
    .finally(() => console.log('Finalizado'));
