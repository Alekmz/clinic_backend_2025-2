// ## Exercício 7 — Inversão de Texto com Pilha

// Use uma pilha para inverter uma string, empilhando cada letra e depois desempilhando tudo.

let string = "palavra"
[      a,p]

const pilhaFinal = [...string].reduce((pilha, caractere) => {
    return [caractere, ...pilha]
},[])

let pilha=[]
let j = 0
for(let i = string.length - 1; i>=0; i--){
    pilha[i] = string[j]
    j++
}
console.log(pilha)
console.log(pilhaFinal)