const GetStorage = (clave) => {
    return localStorage.getItem(clave);
}

const SaveStorage = (clave,valor) => {
    localStorage.setItem(clave, valor);
}

const DeleteStorage = (clave) => {
    localStorage.removeItem(clave);
}




export { GetStorage, SaveStorage,DeleteStorage};