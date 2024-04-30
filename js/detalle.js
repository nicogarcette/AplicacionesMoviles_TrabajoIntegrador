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
                            <div class="detalle-card">
                                <div class="detalle-items">
                                    <p class="detalle-titulo">${data.title}</p>
                                    <img class="detalle-img" src="${data.pictures[0].secure_url}" alt="">
                                    <p class="detalle-precio">$${data.price}</p>
                                </div>
                                <div class="detalle-descripcion">
                                    <p>${descripcion.plain_text}</p>
                                </div>
                            </div>
                        </section>`

}
