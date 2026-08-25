abstract class Pagamento {
  abstract realizarPagamento(): string;    
}

class CartaoCredito extends Pagamento {
    realizarPagamento() {
        return "CartaoCredito"
    }
}

class Boleto extends Pagamento {
    realizarPagamento() {
        return "Boleto"
    }
}

class PayPal extends Pagamento {
    realizarPagamento() {
        return "PayPal"
    }
}

const cartaoCredito = new CartaoCredito()
console.log(cartaoCredito.realizarPagamento())
const boleto = new Boleto()
console.log(boleto.realizarPagamento())
const payPal = new PayPal()
console.log(payPal.realizarPagamento())