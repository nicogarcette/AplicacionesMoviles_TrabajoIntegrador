import { GetStorage, SaveStorage} from './helpers/helper.js';
import carrito from './class/carrito.js';
import producto  from './class/producto.js';

const itemTotal= document.getElementById("item_total");
const KeyCarrito = "carrito"
const url = 'https://api.mercadolibre.com/sites/MLA/';
const UrlCategorias = "categories";

const ActualizarContador = () =>{
    let cantidad = carrito.cantidadDeProductos();
    itemTotal.innerHTML = cantidad;
}

const GetData = async (url)=>{
    const response = await fetch(url);
    return await response.json();;
}

const getCategorias = async () =>{

    return await GetData(url+UrlCategorias);
}

const categorias = await getCategorias();

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

            carrito.AddProducto(new producto(element.id,element.title,element.price,element.thumbnail));
            SaveStorage(KeyCarrito,JSON.stringify(carrito.GetCarrito()));
            ActualizarContador();
        })
    })

    data.results.forEach((element)=>{
        document.getElementById(`btn-ver${element.id}`)?.addEventListener("click",()=>{

            AddProductInHistorial(element);

            let detalleId = element.id;
            window.location.href = `./pages/detalle.html?detalle=${detalleId}`
        })
    })
}

const AddProductInHistorial = (element) =>{
    let product = new producto(element.id,element.title,element.price,element.thumbnail);

    let listaHistorial = JSON.parse(localStorage.getItem("historial")) || [];
    let existe = listaHistorial.some(producto => producto.id === product.id);

    if (!existe) {
        listaHistorial.push(product);
        SaveStorage("historial",JSON.stringify(listaHistorial));
    }
}

const GetProductByInput = async (input) =>{

    let api = url + UrlByInput(input);
    let data = await GetData(api);
    AgregarCards(data);
}

const optionMenu = document.querySelector(".select-menu");
const selectBtn = document.querySelector(".select-btn");

selectBtn.addEventListener("click", () => { 
    optionMenu.classList.toggle('active');
} );

// Manejar el evento submit del formulario
document.querySelector('.search-form').addEventListener('submit', (event) => {
    event.preventDefault();

    var input = document.getElementById("search");
    var valor = input.value;

    GetProductByInput(valor);
});

cargarProductos(GetCategoriaRandon(categorias));
AgregarBuscador(categorias.slice(0,10));
ActualizarContador();