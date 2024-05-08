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

var map = L.map('map');
var control;

// ubicacion directa del vendedor
const ubicacionVendedor = (localidad) => {

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(localidad))
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var cordenadas = {
                latitud : parseFloat(data[0].lat),
                longitud : parseFloat(data[0].lon)
            }

            map = map.setView([cordenadas.latitud, cordenadas.longitud], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            L.marker([cordenadas.latitud,cordenadas.longitud]).addTo(map)
            .bindPopup(`<b>${localidad}</b>`).openPopup();

            control = L.Routing.control({
                waypoints: [],
                routeWhileDragging: true,
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);

        } else {
            console.error("No se encontraron coordenadas para la localidad especificada.");
        }
    })
    .catch(error => {
        console.error("Error al obtener las coordenadas:", error);
    });
}

const calcularRuta = (destino) => {
    
    // obtenemos las cordenas del destino
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(destino))
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var destinoCoords = [data[0].lat, data[0].lon];

                //obtenenmos el origen del usuario
                navigator.geolocation.getCurrentPosition((position)=> {
                    var origen = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // vaciamos el marcador
                    control.setWaypoints([]);
 
                    // Establecemos los nuevos marcadores
                    control.setWaypoints([
                        L.latLng(origen.lat, origen.lng),
                        L.latLng(destinoCoords[0], destinoCoords[1])
                    ]);
                    
                    // Centramos el mapa en la ubi del usuario
                    map.setView([origen.lat, origen.lng], 12);

                    L.marker([origen.lat, origen.lng]).addTo(map)
                        .bindPopup(`<b>Tu ubicación</b>`).openPopup();

                    L.marker([destinoCoords[0], destinoCoords[1]]).addTo(map)
                        .bindPopup(`<b>Vendedor:</b><br>${destino}`).openPopup();

                }, function () {
                    alert('No se pudo obtener la ubicación del usuario.');
                });
            } else {
                alert('No se ha encontrado el destino.');
            }
        })
        .catch(error => {
            console.error('Error al geocodificar:', error);
        });
}
