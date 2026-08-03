// Código síncrono
console.log("Primeiro");
console.log("Segundo");

console.log("-------------------")

// Código assíncrono
console.log("Primeiro");
setTimeout(() => {  console.log("Terceiro (depois de 2s)");}, 2000);
console.log("Segundo");
