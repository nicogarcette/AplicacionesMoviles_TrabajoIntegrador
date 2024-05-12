import {SaveStorage,GetStorage,GetData} from './helpers/helper.js';
import carrito from './class/carrito.js';
import producto  from './class/producto.js';


let CategoryId;
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    CategoryId = urlParams.get('category');

    cargarCategorias(CategoryId);
    ActualizarContador();
});


const itemTotal = document.getElementById("item_total");
const url = 'https://api.mercadolibre.com/sites/MLA/';
let filtros;
const UrlByCategoria =(categoria)=> `${url}search?category=${categoria}&limit=10`;

const cargarCategorias = async (categoriaId) =>{

    document.querySelector(".titulo_categoria").textContent = GetStorage("categoria");
    
    let api = UrlByCategoria(categoriaId);
    let data = await GetData(api);
    filtros = GetFilters(data.available_filters);

    showFilter(filtros)
    AgregarCards(data);
}



const GetFilters = (filtros) =>{

    const list  = [];
    const filtrosTentantivos = ['ITEM_CONDITION','price','BRAND','official_store','state','shipping_cost'];
    
    filtrosTentantivos.forEach(filtroId =>{
        let filtro = filtros.find(x => x.id == filtroId)
      
        if (filtro) {
    
            if (filtro.values && filtro.values.length > 20) {
                let valoresAleatorios = [];
            
                while (valoresAleatorios.length < 20) {
                    let indiceAleatorio = Math.floor(Math.random() * filtro.values.length);
                    valoresAleatorios.push(filtro.values[indiceAleatorio]);
                }
                
                filtro.values = valoresAleatorios;
            }
            list.push(filtro);
        }
    })
    
    return list;
}

const showFilter = (data) =>{

    console.log(data)
    const formFilter = document.getElementById("form_filter");

    data.forEach(item => {
        var selectElement = document.createElement("select");
        selectElement.classList.add("form_input");
        selectElement.setAttribute("id", item.name);
     

        var defaultOption = document.createElement("option");
        defaultOption.setAttribute("value", "");
        defaultOption.setAttribute("disabled", "");
        defaultOption.setAttribute("selected", "");
        defaultOption.textContent = item.name;
        selectElement.appendChild(defaultOption);

        // options
        item.values.forEach(value =>{
            var option = document.createElement("option");
            option.setAttribute("value", value.id);
            option.textContent = value.name;
            selectElement.appendChild(option);
        })

        var formItem = document.createElement("div");
        formItem.classList.add("form_item");
        formItem.appendChild(selectElement);
        formFilter.appendChild(formItem);

    })


    filtros.forEach(item => {

        let element = document.getElementById(item.name);

    })    



}

const ActualizarContador = () =>{
    let cantidad = carrito.cantidadDeProductos();
    itemTotal.innerHTML = cantidad;
}



document.getElementById("filtrar").addEventListener("click",()=> addFilters());
                
const addFilters = async () =>{

    let url = "";
    filtros.forEach(item => {

        let element = document.getElementById(item.name);
        if(element.value)
            url += `&${item.id}=${element.value}`;
    }) 

    let api = UrlByCategoria(CategoryId) + url;
   
    let data = await GetData(api);
    console.log(data.results);
    data.results.length === 0? SinResultados() : AgregarCards(data);
    
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
            SaveStorage("carrito",JSON.stringify(carrito.GetCarrito()));
            ActualizarContador();
        })
    })

    data.results.forEach((element)=>{
        document.getElementById(`btn-ver${element.id}`)?.addEventListener("click",()=>{

            AddProductInHistorial(element);
            let detalleId = element.id;
            window.location.href = `./detalle.html?detalle=${detalleId}`
        })
    })
}


const SinResultados=()=>{
    let allcards = document.getElementById("cards-productos");
    allcards.innerHTML= `<section class="notResult">
    <img class="notResult-img" src="../img/notResult.png" alt="order">
    <h3>No se encontraron resultados</h3>
</section>`;
    

};

const AddProductInHistorial = (element) =>{
    let product = new producto(element.id,element.title,element.price,element.thumbnail);

    let listaHistorial = JSON.parse(localStorage.getItem("historial")) || [];
    let existe = listaHistorial.some(producto => producto.id === product.id);

    if (!existe) {
        listaHistorial.push(product);
        SaveStorage("historial",JSON.stringify(listaHistorial));
    }
}



document.addEventListener("DOMContentLoaded", function() {
    
    var filterBtn = document.querySelector('.filter-btn');
    var contentFilter = document.querySelector('.content-filter');

    filterBtn.addEventListener('click', function() {
        
        if (contentFilter.style.display === 'none') {
            contentFilter.style.display = 'block';
        } else {
            contentFilter.style.display = 'none';
        }
    });
});

document.getElementById("limpiar-filtro").addEventListener("click",()=>{
    document.getElementById("form_filter").innerHTML = '';
    cargarCategorias(CategoryId);
})
