let fila = [5, 7, 8, 10, 12, 15, 16]
let inicio_fila = 0

function removerDaFila(){
    if(fila.length === 0) return "Fila vazia"
    const removido = fila[inicio_fila]
    fila[inicio_fila] = undefined
    inicio_fila += 1
    return removido;
}
function enfileirar(valor){
    console.log(fila.length)
    fila[fila.length] = valor // pode ser assim

    //ou assim: fila.push(valor)
}

console.log(fila)
console.log(removerDaFila())
console.log(fila)
console.log(enfileirar(10))
console.log(fila)
