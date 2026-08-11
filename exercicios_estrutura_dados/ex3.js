let fila = []
let inicio_fila_sp = 0
let inicio_fila_cp = 0

function removerDaFila(){
    if(fila.length === 0) return "Fila vazia"
    const removido = fila[inicio_fila]
    fila[inicio_fila] = undefined
    inicio_fila += 1
    return removido;
}
function enfileirar(valor, idoso){
    if(idoso){
        if(fila[inicio_fila_cp] !== undefined) {
            const filaOriginal = [...fila]
            let arraySemPrioridade = []
            let arrayComPrioridade = []

            fila[inicio_fila_cp] = valor

            for(let i = 0; i <= inicio_fila_cp; i++){
                console.log(fila[i])
                arrayComPrioridade.push(fila[i])
            }
            for(let i = inicio_fila_cp; i < fila.length; i++){
                console.log(filaOriginal[i])
                arraySemPrioridade.push(filaOriginal[i])
            }
            console.log(arraySemPrioridade, arrayComPrioridade, fila)
            fila = [...arrayComPrioridade, ...arraySemPrioridade]
            inicio_fila_cp++
            inicio_fila_sp++
        } else {
        fila[inicio_fila_cp] = valor
        inicio_fila_cp++
        inicio_fila_sp++
        }
    }
    else {
        fila[inicio_fila_sp] = valor
        inicio_fila_sp++
    }

}

console.log(enfileirar("Sebastiao", true)) // cp = 0 -> 1 | sp = 0 ->
console.log(enfileirar("Jose", true)) // cp = 1 -> 2 | sp = 1 ->2
console.log(enfileirar("Maria", false)) // sp = 2 -> 3 | cp = 2
console.log(enfileirar("Ana", true))
console.log(enfileirar("Carlos", false))
console.log(enfileirar("Joao", true))
console.log(enfileirar("Thiago", false))
console.log(enfileirar("Ze", true))

console.log(fila)
