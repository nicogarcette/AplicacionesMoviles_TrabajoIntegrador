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


export { calcularRuta, ubicacionVendedor};
