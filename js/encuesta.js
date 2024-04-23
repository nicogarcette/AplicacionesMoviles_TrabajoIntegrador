const formulario = document.getElementById("form");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const sexo = document.getElementById("sexo");
const valoracion = document.getElementById("valoracion");
const comentario = document.getElementById("comment");
const enviar = document.getElementById("enviar");

enviar.addEventListener("click", (event) =>{

    event.preventDefault();
    ValidarFormulario();

})

const ValidarFormulario = () =>{

    if(esVacio(nombre.value) || !esTextoValido(nombre.value)){
        errorEncuesta();
        return;
    }  

    if(esVacio(apellido.value) || !esTextoValido(apellido.value)){
        errorEncuesta();
        return;
    }  
    
    if(esVacio(email.value) || !esEmailValido(email.value)){
        errorEncuesta();
        return;
    }  
    
    if(esVacio(fechaNacimiento.value)){
        errorEncuesta();
        return;
    }  

    if(esVacio(valoracion.value)){
        errorEncuesta();
        return;
    }

    if(esVacio(sexo.value)){
        errorEncuesta();
        return;
    }

    let encuesta = createEncuesta();
    var contenido = document.getElementById("contenido-encuesta");

    contenido.innerHTML += `<div id="valores" class=" categoria valores_encuesta">
                                <h2>Encuenta enviada</h2>
                                <p>Nombre: ${encuesta.nombre}</p>
                                <p>Apellido: ${encuesta.apellido}</p>
                                <p>email: ${encuesta.email}</p>
                                <p>fecha de nacimiento: ${encuesta.fechaNacimiento}</p>
                                <p>valoracion: ${encuesta.valoracion}</p>
                                <p>SEXO: ${encuesta.sexo}</p>
                                <p>Comentario: ${encuesta.comentario}</p>
                            </div>`;
}

const errorEncuesta = () => {

    var contenido = document.getElementById("contenido-encuesta");

    contenido.innerHTML += `<div id="valores" class=" categoria valores_encuesta">
                                <p>Error en los datos de la encuesta!</->
                            </div>`;
}


const createEncuesta = () =>{

    var encuesta = {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        fechaNacimiento: fechaNacimiento.value,
        valoracion: valoracion.value,
        sexo: sexo.value,
        comentario: comentario.value
    };

    return encuesta;
}

const esVacio = (value)=> {
    return value === "";
}

const esTextoValido = (name)=> {
    return /^[a-zA-Z]+$/.test(name);
}

const esEmailValido = (email)=> {
    var expresion = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return expresion.test(email);
}

const cleanInput = document.getElementById("cleanInput");

cleanInput.addEventListener('click', (event) => {
    event.preventDefault();
    resetValues();
});

const resetValues = ()=> {
    
    var inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.value = ''; 
    });
}

// modal
document.getElementById('openModal').addEventListener('click', (event)=> {
    event.preventDefault();
    document.getElementById('modal').style.display = 'block';
});
  
document.getElementsByClassName('close')[0].addEventListener('click', ()=> {
    document.getElementById('modal').style.display = 'none';
});
  
window.addEventListener('click', (event)=> {
    if (event.target == document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
});

document.getElementById('btn-back').addEventListener('click', ()=> {
    window.history.back(); 
});