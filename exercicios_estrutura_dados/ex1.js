const enfileirar = (fila, valor) => [...fila, valor];

const desenfileirar = (fila) => {
  if (estaVazia(fila)) return { valor: null, novaFila: fila };
  const [primeiro, ...novaFila] = fila;
  return { valor: primeiro, novaFila: novaFila };
};

const verPrimeiro = (fila) => (estaVazia(fila) ? null : fila[0]);

const estaVazia = (fila) => fila.length === 0;

// simulação
const pessoas = ["Ana", "Bruno", "Carla", "Diego", "Elisa"];

let fila = [...pessoas]


console.log(desenfileirar([]).valor)
while (!estaVazia(fila)) {
  const { valor, novaFila } = desenfileirar(fila);
  console.log(verPrimeiro(fila))
  console.log(`Atendendo: ${valor}`);
  console.log(verPrimeiro(novaFila))

  fila = novaFila;
}