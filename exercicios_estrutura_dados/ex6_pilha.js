function validacaoBalanceamento(expressao) {
    const pilhaFinal = [...expressao].reduce((pilha, caractere)=>{
        if(pilha==null) return null;
        if(caractere == '(') return [...pilha, caractere]
        if(caractere == ')'){
            if(pilha.length == null) return null   
            return pilha.slice(0, -1)
        }
        return pilha
    })
    return pilhaFinal !== null && pilhaFinal.length === 0
}

console.log(validacaoBalanceamento("(j)(jk()"))
