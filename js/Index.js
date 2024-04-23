import { GetStorage, SaveStorage ,DeleteStorage} from './helpers/helper.js';

const itemTotal= document.getElementById("item_total");
const KeyCarrito = "carrito"

class producto{
    constructor(id,marca,modelo,precio,imagen){

        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
    }
}

class Carrito{
    constructor(){

        this.carrito=[];
    }

    GetCarrito(){
        return this.carrito;
    }

    AddProducto(producto){

        let existe = this.carrito.find(item => item.id === producto.id);
        
        existe ?  existe.cantidad++ : this.carrito.push({...producto});
    }

    RemoverItem(posicion){
        this.carrito.splice(posicion,1);
    }

    cantidadDeProductos() {
        let cantidadTotal = this.carrito.reduce( (total, item) => total + item.cantidad, 0 );            
        return cantidadTotal;
    }

    Subtotal(){
        let precioTotal = this.carrito.reduce( (acumulador, x) => acumulador + ( x.precio * x.cantidad) ,0);
        return precioTotal.toFixed(2);
    }

    LimpiarCarrito(){

        this.carrito.splice(0, this.carrito.length);
        DeleteStorage("carrito");
        itemTotal.innerHTML = 0;
    }
    
    ActualizarCarrito(){
        let cantidad = this.cantidadDeProductos();
        itemTotal.innerHTML = cantidad;
    }
}
export const listaCompra = new Carrito;

const ActualizarContador = () =>{
    let cantidad = listaCompra.cantidadDeProductos();
    itemTotal.innerHTML = cantidad;
}

const cargarCarrito = () =>{
    var listaCarrito =JSON.parse(GetStorage(KeyCarrito));

    if(listaCarrito && listaCarrito.length !== 0){
        listaCompra.carrito = listaCarrito;
        ActualizarContador();
    }
}

const GetData = async (url)=>{
    const response = await fetch(url);
    let data = await response.json();

    return data;
}

const cargarProductos= async ()=>{

    let data = await GetData("https://fakestoreapi.com/products?limit=10");
    
    let allcards=document.getElementById("zapatilla-cards");
    allcards.innerHTML= "";
    data.forEach((element)=>{

        
        allcards.innerHTML+=    `<article class="card">
        <h2>${element.title}</h2>         
        <img class="card-img" src="${element.image}" alt="zapatilla">
        <p class="p-size">${element.price}</p>
        <button id="btn-producto${element.id}" class="btn">Agregar</button>
    </article>`;
    
    })

    data.forEach((element)=>{
        document.getElementById(`btn-producto${element.id}`)?.addEventListener("click",()=>{

            listaCompra.AddProducto(new producto(element.id,element.title,"generico",element.price,element.image));
            SaveStorage(KeyCarrito,JSON.stringify(listaCompra.GetCarrito()));
            ActualizarContador();
        })
    })
}
cargarProductos();
cargarCarrito();
