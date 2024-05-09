class Carrito{
    constructor(){
        this.carrito=[];
         this.cargarCarritoDesdeLocalStorage();
    }

    cargarCarritoDesdeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado)
            this.carrito = JSON.parse(carritoGuardado);
    }

    GetCarrito(){
        return this.carrito;
    }

    SetCarrito(carrito){
        this.carrito = carrito;
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
        return 0;
    }
    
    ActualizarCarrito(){
        let cantidad = this.cantidadDeProductos();
        return cantidad;
    }
}

window.carrito = new Carrito();
export default window.carrito;