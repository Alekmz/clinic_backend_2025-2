let pilha = [5, 7, 8, 10, 12, 15, 16]

function removerDaPilha (){
    return pilha.pop()
}

function colocarNaPilha(valor){    
return pilha.push(valor) // pode ser assim
    //ou assim: pilha[pilha.length] = valor 
}


console.log(pilha)
console.log(removerDaPilha())
console.log(pilha)
console.log(colocarNaPilha(75))
console.log(pilha)