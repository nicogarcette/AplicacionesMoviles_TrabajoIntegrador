import { GetStorage, SaveStorage ,DeleteStorage} from './helpers/helper.js';

const itemTotal= document.getElementById("item_total");
const KeyCarrito = "carrito"

class producto{
    constructor(id,nombre,precio,imagen){

        this.id = id;
        this.nombre = nombre;
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

const getCategorias = async () =>{

    return await GetData(url+UrlCategorias);
}
const url = 'https://api.mercadolibre.com/sites/MLA/';
const UrlCategorias = "categories";
const categorias = await getCategorias();

const optionMenu = document.querySelector(".select-menu");
const selectBtn = document.querySelector(".select-btn");


const GetCategoriaRandon=(categorias)=>{

    let indiceRandon = Math.floor(Math.random() * categorias.length);
    let categoriaRamdon = categorias[indiceRandon];
    return categoriaRamdon.id;
}

const UrlByCategoria =(categoria)=> `search?category=${categoria}&limit=10`;
const UrlByInput =(input)=> `search?q=${input}&limit=10`;

const AgregarBuscador = (categorias) =>{
    
    const select = document.getElementById("optionsCategories");
    
    categorias.map(element =>{
        select.innerHTML += `<li class="option">
                                <span class="option-text" data-value="${element.id}">${element.name}</span>
                            </li>`;
    })


    const options = document.querySelectorAll(".option");
    const btnText = document.getElementById("select-text");
    
    options.forEach(option=>{
        option.addEventListener("click",()=>{
            
            let category = option.querySelector(".option-text");
            btnText.innerText = category.textContent;
            cargarProductos(category.getAttribute('data-value'));

            optionMenu.classList.remove("active");
        })
    })

}

// la primera carga
const cargarProductos= async (categoriaId)=>{

    let api = url + UrlByCategoria(categoriaId);
    let data = await GetData(api);
    AgregarCards(data);
}

const AgregarCards=(data)=>{

    let allcards = document.getElementById("cards-productos");
    allcards.innerHTML= "";
    data.results.forEach((element)=>{

        let card = document.createElement('article');
        card.classList.add('card');
        card.innerHTML = `  <p class="card-titulo">${element.title}</p>         
                            <img class="card-img" src="${element.thumbnail}" alt="producto" data-id="${element.id}">
                            <p class="p-size">$${element.price}</p>

                            
                            <div class="buttons-card">
                                <button id="btn-producto${element.id}" class="btn">Agregar</button>
                                <button id="btn-ver${element.id}" class="btn">ver mas</button>
                            </div>
                            `;

        allcards.appendChild(card);
    })

    data.results.forEach((element)=>{
        document.getElementById(`btn-producto${element.id}`)?.addEventListener("click",()=>{

            listaCompra.AddProducto(new producto(element.id,element.title,element.price,element.thumbnail));
            SaveStorage(KeyCarrito,JSON.stringify(listaCompra.GetCarrito()));
            ActualizarContador();
        })
    })

    data.results.forEach((element)=>{
        document.getElementById(`btn-ver${element.id}`)?.addEventListener("click",()=>{

            let detalleId = element.id;
            window.location.href = `./pages/detalle.html?detalle=${detalleId}`
        })
    })
}

const GetProductByInput = async (input) =>{

    let api = url + UrlByInput(input);
    let data = await GetData(api);
    AgregarCards(data);
}

// Manejar el evento submit del formulario
document.querySelector('.search-form').addEventListener('submit', (event) => {
    event.preventDefault();

    var input = document.getElementById("search");
    var valor = input.value;

    GetProductByInput(valor);
});

selectBtn.addEventListener("click", ()=> optionMenu.classList.toggle("active"));

cargarProductos(GetCategoriaRandon(categorias));
AgregarBuscador(categorias.slice(0,10));
cargarCarrito();
