 class Funcionario {
    nome:string;
    constructor(nome:string){
        this.nome = nome;
    }
   calcularSalario():number{
        return 0
   };
}

class Programador extends Funcionario {
    nivel:string;

    constructor(nome:string, nivel:string){
        super(nome)
        this.nivel = nivel;
    }
  calcularSalario(): number {
    return 5000;
  }
  mostrarNivel():string{
    return this.nivel;
  }
}

class Designer extends Funcionario {
  calcularSalario(): number {
    return 4000;
  }
}

const designer = new Designer("Claudio")