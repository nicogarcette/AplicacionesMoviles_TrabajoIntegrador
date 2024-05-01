// datos formulario
const form = document.getElementById("form");
const inputs = [...document.querySelectorAll(".form_input")]; 
const nombre = document.getElementById("nombre");
const surname = document.getElementById("surname");
const email = document.querySelector("#email");
const phone = document.getElementById("phone");
const dni = document.getElementById("dni");
const formError = document.getElementById("form_mensajeError");

// objeto con expreciones regulares para validar datos
const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	phone: /^\d{8,14}$/ 
}

// objeto para validar que todos los campos esten correctos.
const campos={
    nombre:false,
    surname:false,
    email:false,
    phone:false,
    dni:false
}

const checkCampos=()=>{return campos.nombre && campos.surname && campos.email && campos.dni && campos.phone};
//error
const valueWrong=(input)=>{
    const padre=input.parentElement.parentElement;
    padre.className="form_grupo-incorrecto";
    return false;
}
//correcto
const valueRight=(input)=>{
    const padre=input.parentElement.parentElement;
    padre.className="form_grupo-correcto";
    return true;
}

// valida los campos
const validarCampo=(input,expresion)=>{

    if (input.value === ""){
        return valueWrong(input);
    }

    if (!expresion.test(input.value)) {
        return valueWrong(input);
    }
    
    return valueRight(input);
}

const validarTelefono=()=>{

    if (phone.value === "") {
       return valueWrong(phone);
    }

    if((!expresiones.phone.test(phone.value))||(phone.value.length<10)) {
        return valueWrong(phone); 
    }

    return valueRight(phone);
}

// selecciona el input que corresponda y lo valida.
const validarFormulario=(input)=>{
    
    switch (input) {
        case nombre:
            campos.nombre = validarCampo(nombre,expresiones.nombre,campos.nombre);
            break;

        case surname:
            campos.surname = validarCampo(surname,expresiones.nombre,campos.surname);
            break;

        case email:
            campos.email = validarCampo(email,expresiones.email,campos.email);
            break;
        case phone:
            campos.phone = validarTelefono();
            break;
        case dni:
            campos.dni = validarCampo(dni,expresiones.phone,campos.dni);
            break;
   
        default:
            break;
    }
    if(checkCampos()){
        formError.classList.remove("form_mensajeError-active");
    }
}


const checkoutFormulario = () =>{
    form.noValidate = true;

    form.addEventListener("submit", (event) =>{

        event.preventDefault();

        inputs.forEach(input => {
            validarFormulario(input);   
        });
        
        if (checkCampos()) {
            const loader = document.getElementById("loader");
            loader.classList.remove("loader2");
            setTimeout(() => {
                mercadoPago();
                localStorage.removeItem("carrito");
            }, 3000);
        }else{
            formError.classList.add("form_mensajeError-active");
        }
    })

    inputs.forEach(input => {
        input.addEventListener(`keyup`,()=>validarFormulario(input));
        input.addEventListener(`blur`,()=>validarFormulario(input));    
    });
}



checkoutFormulario();
