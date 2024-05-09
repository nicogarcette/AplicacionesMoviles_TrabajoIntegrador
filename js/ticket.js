const randomHexadecimal = () => Math.floor(Math.random() * 16).toString(16);
const bloqueHexadecimal = () => randomHexadecimal() + randomHexadecimal() + randomHexadecimal() + randomHexadecimal();
const guid = `${bloqueHexadecimal()}-${bloqueHexadecimal()}-${bloqueHexadecimal()}-${bloqueHexadecimal()}-${bloqueHexadecimal()}`;
document.getElementById("guid").textContent = guid.toUpperCase();