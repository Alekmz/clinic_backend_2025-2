let lista_encadeada = {
    valor: 50,
    proximo: null
};

function acrescentarLista(lista, valor) {
    const novoNo = {
        valor: valor,
        proximo: null
    };

    if (!lista) {
        return novoNo;
    }

    let atual = lista;
    
    while (atual.proximo !== null) {
        atual = atual.proximo;
    }

    atual.proximo = novoNo;

    return lista;
}

acrescentarLista(lista_encadeada, 60);
acrescentarLista(lista_encadeada, 70);

console.log(lista_encadeada);