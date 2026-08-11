function operacaoPromisse(a, b, op) { 
    return new Promise((resolve, reject) => 
        { 
            setTimeout(() => { 
                if(op == 'soma') resolve(a+b)
                else if(op == 'divisao') resolve(a/b)
                else if(op == 'multiplicacao') resolve(a*b)
                else if(op=='subtracao') resolve(a-b)
                else reject(new Error('A operação solicitada não existe!')); 
            }, 2000); 
        }
    );
}

operacaoPromisse(10, 5, 'sfsdfsf')
    .then(resultado => console.log(resultado))
    .catch(erro => console.error(erro))
    .finally(() => console.log('Finalizado'));
