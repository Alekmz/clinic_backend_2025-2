
abstract class FormaGeometrica  {
  abstract calcularArea(): number;    
}

class Circulo extends FormaGeometrica  {
    raio:number
    constructor(raio:number){
        super()
        this.raio = raio
    }
    calcularArea() {
        return 3.14 * (this.raio ** 2)
    }
}

class Quadrado  extends FormaGeometrica {
    lado:number
    constructor(lado:number){
        super()
        this.lado = lado
    }
    calcularArea() {
        return this.lado ** 2
    }

}

class Retangulo  extends FormaGeometrica {
    comprimento:number
    altura:number
    constructor(comprimento:number, altura:number){
        super()
        this.comprimento = comprimento
        this.altura = altura
    }
    calcularArea() { 
        return this.comprimento * this.altura
    }
}

const circulo = new Circulo(50);
console.log(circulo.calcularArea())
const quadrado = new Quadrado(50);
console.log(quadrado.calcularArea())
const retangulo = new Retangulo(50, 10);
console.log(retangulo.calcularArea())