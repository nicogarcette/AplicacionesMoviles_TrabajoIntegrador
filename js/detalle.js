import { calcularRuta, ubicacionVendedor} from './geolocalizacion.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const DetalleId = urlParams.get('detalle');

    cargarDetalle(DetalleId);
});

const cargarDetalle = async (DetalleId) =>{

    const response = await fetch(`https://api.mercadolibre.com/items/${DetalleId}`);
    const responseDescription = await fetch(`https://api.mercadolibre.com/items/${DetalleId}/description`);
    const data = await response.json();
    const descripcion = await responseDescription.json();
    const detalle = document.getElementById("detalle");

    detalle.innerHTML = ` <section class="detalle">
                            <h2 class="titulo_detalle">Detalle</h2>
                            <h3 class="detalle-titulo">${data.title} </h3>
                            <div class="detalle-card">
                                <div class="detalle-items">
                                    <img class="detalle-img" src="${data.pictures[0].secure_url}" alt="">
                                    <p class="detalle-precio">$${data.price}</p>
                                </div>
                                <div class="detalle-descripcion">
                                    <p>${descripcion.plain_text}</p>
                                </div>
                            </div>
                        </section> 
                    `
                    
    detalle.innerHTML +=  generarCaracteristicas(data.attributes);

    let localidadVendedor = data.seller_address.city.name;
    let pais = data.seller_address.country.name;
    let ubicacion = `${localidadVendedor}, ${pais}`;
    ubicacionVendedor(ubicacion)
    document.getElementById("indication").addEventListener("click", ()=> calcularRuta(ubicacion));
}

const generarCaracteristicas =(atributos)=>{
    
    let section = `<section class="detalle">
                        <h2 class="titulo_detalle">Caracteristicas</h2>
                        <div class="caracteristicas">
                        ${atributos.map(element =>{
                            return `<div class="caracteristica_item">
                                        <p class="caracteristica_item_p">${element.name}:</p>
                                        <p>${element.value_name??'-'}</p>
                                    </div>`
                        }).join('')}
                        </div>
                    </section>`;

    return section;
}
