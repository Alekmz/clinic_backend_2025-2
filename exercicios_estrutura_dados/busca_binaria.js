let contador = 0

function buscaBinaria(array, numero){
    let inicio = 0;
    let fim = array.length - 1
    while(inicio <= fim){
        contador++
        const meio = Math.floor((inicio + fim)/2)
        console.log(`inicio ${inicio}, meio ${meio}, fim ${fim}`)
        if(numero === array[meio]) return meio;
        if(numero > array[meio]) inicio = meio + 1
        else fim = meio - 1
    }
    return -1

}

console.log(buscaBinaria([30, 40, 45, 50, 55, 60, 70], 70), contador)