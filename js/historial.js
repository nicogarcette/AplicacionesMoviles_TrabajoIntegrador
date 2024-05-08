let ListaHistorial = JSON.parse(localStorage.getItem("historial"));
const historial = document.getElementById("historial");

const cargarHistorial=()=>{
    historial.innerHTML = '';
    var tituloHistorial = document.createElement("h2");
    tituloHistorial.classList.add("titulo-historial");
    tituloHistorial.textContent = "Historial";
    historial.appendChild(tituloHistorial);

    let tabla = `<table class="tabla">
                <thead class="tabla-head">
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-body"></tbody>
            </table>`;

    historial.innerHTML+= tabla;

    cargarTabla();

};

const cargarTabla=()=>{
    let tablaContenido = document.getElementById("tabla-body");
    tablaContenido.innerHTML = '';
    ListaHistorial.forEach(element => {
        tablaContenido.innerHTML += createRow(element);
    });

    ListaHistorial.forEach((element)=>{
        document.getElementById(`btn-ver${element.id}`)?.addEventListener("click",()=>{
    
            let detalleId = element.id;
            window.location.href = `./detalle.html?detalle=${detalleId}`
        })
    })

    ListaHistorial.forEach((element)=>{
        document.getElementById(`btn-delete${element.id}`)?.addEventListener("click",()=>{
            ListaHistorial = ListaHistorial.filter(producto => producto.id !== element.id);

            localStorage.setItem("historial",JSON.stringify(ListaHistorial));

            ListaHistorial.length > 0 ? cargarTabla() : historialVacio();
        })
    })
}


const createRow = (element) =>{

    return `<tr>
                <th><img class="tabla-img" src="${element.imagen}" alt=""></th>
                <th>${element.nombre}</th>
                <th>$${element.precio ?? 0}</th>
                <th>
                    <button id="btn-ver${element.id}" class="tabla-boton"><i class="fa-solid fa-eye"></i></i></button>
                    <button id="btn-delete${element.id}" class="tabla-boton"><i class="delete fa-solid fa-trash"></i></button>
                </th>
            </tr>`
}

const historialVacio = () =>{

    let vacio = `<div class="content-vacio">
                    <p>Historial vacio...</p>
                        <button id="verProductosBtn" class="vacio">    
                            <p>ver productos</p>
                            <i class="fa-solid fa-arrow-up"></i>
                        </button>
                </div>`
    historial.innerHTML =  vacio; 
    document.getElementById("verProductosBtn").addEventListener("click", function() {
        window.location.href = "../index.html";
    });         
}
ListaHistorial && ListaHistorial.length > 0 ? cargarHistorial() : historialVacio();




