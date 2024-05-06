import { GetStorage, SaveStorage,DeleteStorage } from '../helpers/helper.js';
import { listaCompra as carrito } from '../Index.js';

const botonesModal=document.getElementById("btnModal");
const contenidoCarrito = document.getElementById("btnCart");

// modal Cart
document.getElementById('openCart').addEventListener('click', (event)=> {
    event.preventDefault();
    document.getElementById('modalCart').style.display = 'block';
});
  
document.getElementsByClassName('close')[0].addEventListener('click', ()=> {
    document.getElementById('modalCart').style.display = 'none';
});
  
window.addEventListener('click', (event)=> {
    if (event.target == document.getElementById('modalCart')) {
      document.getElementById('modalCart').style.display = 'none';
    }
});


// funcionalidad al boton carrito. 
const agregarBotonesCarrito = () =>{

    document.getElementById("openCart").addEventListener("click",()=>{
        
        if (carrito && carrito.GetCarrito().length!=0) {
       
            crearModal2(carrito.GetCarrito(), contenidoCarrito, carrito.Subtotal());
        }
    })

}

const crearModal2=(lista,nodo,total)=>{
    nodo.innerHTML="";
    
    let acumulador=`<div class="grid_carrito">
                        <div class="grid-item"><p class="text_carrito">Producto</p></div> 
                        <div class="grid-item"><p class="text_carrito">Precio</p></div>
                        <div class="grid-item"><p class="text_carrito">Cantidad</p></div>
                        <div class="grid-item" colspan="2"><p class="text_carrito">SubTotal</p></div>
                    </div>`;



    lista.forEach((element)=>{
        let subtotal = element.precio*element.cantidad;
        acumulador+=
        ` <div class="grid_carrito">
            <div class="grid-item">
                <img class="modal-img" src="${element.imagen}">
                <p>${element.nombre}</p>
            </div>

            <div class="grid-item">$${element.precio}</div>

            <div class="grid-item">
                <p id="cant${element.id}">${element.cantidad}</p>
                <div>
                    <a id="btn_restar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-minus"></i></a>
                    <a id="btn_sumar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-plus"></i></a>
                </div>
            </div >

            <div class="grid-item" id="sbTotal${element.id}">$${subtotal.toFixed(2)}</div>

            <div class="grid-item"><a id="trash${element.id}" type="button"><i class="fa-solid fa-trash-can trash"></i></a></div>
        </div>`;
    })

    acumulador+=`<div class="grid_carrito">
                    <div class="grid-item text_center" colspan="3">Total</div> 
                    <div class="grid-item text_center" colspan="2" id="montoTotal"><p class="text_precio">$${total}</p></div>
                </div>`

    nodo.innerHTML=acumulador;
    agregarBotonesModal();
    botonBasura();
    botonSumaResta();
}

const limpiarModal=()=>{
    contenidoCarrito.innerHTML= `<p class="p-size">Carrito vacio</p>`;
    botonesModal.innerHTML="";
}

const agregarBotonesModal=()=>{
    
    botonesModal.innerHTML=`<button id="pagar" type="button" class="btn" data-bs-dismiss="modal">Pagar</button>
                        <button id="limpiar" type="button" class="btn">Vaciar carrito</button>
    `;

    // funcionalidad
    botonPagar();
    botonBorrar("limpiar");
}

// funcion concretar pago.
const botonPagar = () =>{
    
        document.getElementById("pagar").addEventListener("click",()=>{
            const loader = document.getElementById("loader");
            loader.classList.remove("loader2");

            setTimeout(() => {
                location.href="../../pages/checkout.html";
            }, 2000);
        })
}

const botonBasura=()=>{

    carrito.GetCarrito().forEach((element) => {

        document.getElementById(`trash${element.id}`).addEventListener("click",()=>{

            let posicion = carrito.GetCarrito().indexOf(element);
           borrarProductoModal(posicion);
           DeleteStorage("carrito");
        })

    });


}

const botonSumaResta=()=>{

    carrito.GetCarrito().forEach((element)=>{

        document.getElementById(`btn_sumar${element.id}`)?.addEventListener("click",()=>{
    
            let productoIndex = carrito.GetCarrito().indexOf(element);
            carrito.GetCarrito()[productoIndex].cantidad++;
           
            SaveStorage("carrito",JSON.stringify(carrito.GetCarrito()));
            ActualizarModal(element.id,element.precio,element.cantidad);
        });

        document.getElementById(`btn_restar${element.id}`)?.addEventListener("click",()=>{
    
            let index = carrito.GetCarrito().indexOf(element);
        
            if (element.cantidad>1) {
                carrito.GetCarrito()[index].cantidad--;
               
            }else if (element.cantidad===1){
                borrarProductoModal(index);
            }

            SaveStorage("carrito",JSON.stringify(carrito.GetCarrito()));
            ActualizarModal(element.id,element.precio,element.cantidad);
        });    
    })
}

const borrarProductoModal = (index) =>{

    carrito.RemoverItem(index);

    limpiarModal();

    if (carrito.GetCarrito().length != 0) {
        crearModal2(carrito.GetCarrito(),contenidoCarrito,carrito.Subtotal())
    
    }
    
    carrito.ActualizarCarrito();
}

const ActualizarModal=(id,precio,cantidad)=>{

    let cantidadProductos = document.getElementById(`cant${id}`);
    cantidadProductos && (cantidadProductos.innerText = cantidad);
    

    let sbtotal=document.getElementById(`sbTotal${id}`);
    sbtotal && (sbtotal.innerText="$"+(cantidad*precio).toFixed(2));

    let montoTotal=document.getElementById("montoTotal");
    montoTotal && (montoTotal.innerText="$"+carrito.Subtotal());
    carrito.ActualizarCarrito();
}

agregarBotonesCarrito();

const botonBorrar =() => {
    document.getElementById("limpiar").addEventListener("click",()=>{
        Swal.fire({
            title: 'Desea vaciar el carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Continuar compra',
            confirmButtonText: 'Si, vaciar!'
        }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire(
            'EL carrito vacio!',
            'continuar',
            'success',
            carrito.LimpiarCarrito(),
            limpiarModal()
        )
        }})
    });
}
