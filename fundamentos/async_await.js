// Promisse normal
function buscarDados() {  
    return fetch('api/dados')
            .then(resposta => resposta.json())    
            .then(dados => { 
                    console.log(dados);    
                    return dados;    
                })    
            .catch(erro => {      
                console.error(erro);    
            });}

// Promisse com async/await
async function buscarDados() {  
    try {    
        const resposta = await fetch('api/dados');    
        const dados = await resposta.json();    
        console.log(dados);    
        return dados;  
    } 
    catch (erro) { 
        console.error(erro);  
    }
}
