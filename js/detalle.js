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
                        </section>`

}
const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

let mymap = L.map('myMap').setView([-34.9208699,-57.951581],13);

L.tileLayer(tilesProvider, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
})
.addTo(mymap);

let marker = L.marker([-34.9224369,-57.9555662]).addTo(mymap)