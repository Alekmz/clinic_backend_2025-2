let inicio=0, fim=0, quantidade=0, tamanho = 3

function enfileirar(fila, valor) {
    if(quantidade === tamanho) {
        console.log("fila cheia")
    }
    fila[fim] = valor
    fim++
    quantidade++
    return fila

}

function desenfileirar(fila) {
    if(quantidade === 0) {
        console.log("fila vazia")
    }
    valor = fila[inicio]
    fila[inicio] = undefined
    inicio++
    quantidade--
    return {valor, fila}
}

let fila = []

for(let volta = 0; volta < 40; volta++)
{
    fila = enfileirar(fila, `valor volta: ${volta} 1 `)
    fila = enfileirar(fila, `valor volta: ${volta} 2`)
    resultado = desenfileirar(fila)
    console.log(resultado.valor)
    fila = resultado.fila
    resultado = desenfileirar(fila)
    console.log(resultado.valor)
    fila = resultado.fila
    fila = enfileirar(fila, `valor volta: ${volta} 3`)

    resultado = desenfileirar(fila)
    console.log(resultado.valor)
    fila = resultado.fila

}

console.log(fila)

