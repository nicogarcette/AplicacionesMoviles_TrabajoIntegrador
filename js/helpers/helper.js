const GetStorage = (clave) => {
    return localStorage.getItem(clave);
}

const SaveStorage = (clave,valor) => {
    localStorage.setItem(clave, valor);
}

const DeleteStorage = (clave) => {
    localStorage.removeItem(clave);
}

const DeleteElement = (clave, element) => {
    
    let storage = JSON.parse(GetStorage(clave));
    let index = storage.findIndex(item => item.id === element.id);
    storage.splice(index,1);

    SaveStorage(clave, JSON.stringify(storage));
}

const GetData = async (url)=>{
    const response = await fetch(url);
    return await response.json();;
}


export { GetStorage, SaveStorage,DeleteStorage,DeleteElement, GetData};