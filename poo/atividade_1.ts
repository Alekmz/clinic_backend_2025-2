// class Produto {
//     nome: string;
//     preco: number;

//     constructor(nome: string, preco: number) {
//         this.nome = nome;
//         this.preco = preco;
//     }
// }


// class Categoria  {
//     nome:string;
//     desconto:number;

//     constructor(nome:string, desconto:number){
//         this.nome = nome;
//         this.desconto = desconto;
//     }

//     calcularDesconto(precoProduto:number){
//         const desconto = precoProduto * this.desconto
//         const valorFinal =  precoProduto - desconto;
//         return {
//             valor: valorFinal,
//             desconto
//         }
//     }
// }

// const meuProduto = new Produto("Microondas", 500);
// const categoria = new Categoria("Eletrodomestico", 0.25)
// const descontoMeuProduto =categoria.calcularDesconto(meuProduto.preco)
// console.log("O desconto para o produto é:", descontoMeuProduto.desconto, ", e o valor final do produto é:", descontoMeuProduto.valor)


class Categoria {
    nomeCategoria: string;
    desconto: number;

    constructor(nome: string, desconto: number) {
        this.nomeCategoria = nome;
        this.desconto = desconto;
    }

    calcularDesconto() { }
}

class Produto extends Categoria {
    nome: string;
    preco: number;

    constructor(nome: string, preco: number, nomeCategoria: string, descontoCategoria: number) {
        super(nomeCategoria, descontoCategoria)
        this.nome = nome;
        this.preco = preco;
    }

    calcularDesconto() {
        const desconto = this.preco * this.desconto
        const valorFinal = this.preco - desconto;
        return {
            valor: valorFinal,
            desconto
        }
    }
}


const microondas:Produto = new Produto("Microondas", 500, "Eletrodomestico", 0.2)
console.log(microondas)