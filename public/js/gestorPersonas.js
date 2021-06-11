//Declaro la funcion que me permite recorrer directorios
const fs = require('fs');
const fsUtils = require("nodejs-fs-utils");

//Obtengo el archivo con los datos de las personas
let personas = require('../public/json/registroPersonal.json');
//Defino la ruta donde tengo el JSON con los registros personales
const urlJsonPersonas = 'public/json/registroPersonal.json';

//Sobreescribo mi archivo de personas para guardar los cambios
fs.writeFileSync(urlJsonPersonas, JSON.stringify(personas,null,4), 'utf8');

//Obtengo el contenedor donde cargo el listado
let contenedorListado=document.getElementById("listadoPersonas");

//Ordeno el Json por los apellidos de personas
personas = ordenarJSON(personas, 'apellido', 'asc');

//Variables que voy a utilizar para ver cuando se esta mostrando un usuario
let mostrarPersona=false;
let idPersona=null;

//Defino el evento para cargar el modal
document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('.modal');
   var instancesModal = M.Modal.init(elems);
});

//Funcion que me permite ordenar un Array de Json
function ordenarJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

//Funcion que me permite listar una persona buscada
function listarPersona(listaIds) {
 document.getElementById("listadoPersonas").innerHTML=""; //vacio el contenedor
  
    //Genero un elemento de persona por cada IDS encontrado en la busqueda
    for (let i=0; i < listaIds.length; i++) {
     let idPersona= listaIds[i]; //Asigno el ID actual
     //Creo el elemento de la persona
     let a=document.createElement("a");
     a.setAttribute("class","collection-item");
     a.setAttribute("href","#");
     a.setAttribute("id",i);
     a.setAttribute("nombre",personas[idPersona].nombre);
     a.setAttribute("apellido",personas[idPersona].apellido);
     a.addEventListener("click",function(){visualizarPersona(a,personas[idPersona],idPersona)},false);
     a.innerHTML=`<i class="tiny material-icons">account_box</i> ${personas[idPersona].apellido}, ${personas[idPersona].nombre}`;
     contenedorListado.appendChild(a);
    } 
    if (listaIds.length==0) {
     let p=document.createElement("p");
     p.innerHTML="No se han encontrado coincidencias";
     contenedorListado.appendChild(p);
    }

}

//Funcion que me permite buscar una persona entre todas
function buscarPersona() {
 //Recibo los parametros
 let parametroBusqueda=document.getElementById("parametro").value;
 let tipoBusqueda=document.getElementById("tipoBusqueda").value;
 let idsBusqueda=[]; //Array que contendra los ID que coincidan con las busquedas
    //Chequeo que los parametros no sean vacios
    if ((parametroBusqueda=="") || (tipoBusqueda=="default")) {
     M.toast({html: 'Debe completar el parametro y seleccionar tipo de busqueda'});
    }
    else {
     M.toast({html: 'Parametro a buscar '+parametroBusqueda});
     //Vacio el listado de personas listadoPersonas
     console.log("Parametro:"+parametroBusqueda+" | tipoBusqueda:"+tipoBusqueda)

        //Recorro todo el listado
        for (let i=0; i < personas.length ; i++) {
            //Consulto si el elemento actual es el buscado        
            if ((personas[i].apellido==parametroBusqueda) && (tipoBusqueda=="apellido")) {
             idsBusqueda.push(i);             
            }
            if ((personas[i].cuit==parametroBusqueda) && (tipoBusqueda=="cuit")) {             
             idsBusqueda.push(i);     
            }
        } 
     //Invoco a la funcion que me genera los elementos de la busqueda
     listarPersona(idsBusqueda); 
    }
}

//Funcion que me desactiva un elemento del listado
function desactivarPersonasActivas() {
 let elementos=document.getElementById("listadoPersonas").getElementsByClassName("collection-item");
    //Le saco la clase active a todos los elementos
    for (let i=0; i < elementos.length; i++) {
       elementos[i].setAttribute("class","collection-item");
    }
}

//Funcion que me updatea los datos de una persona
function actualizarDatos() {
    if (mostrarPersona==false) {
 	 M.toast({html: 'No se ha seleccionado ninguna persona'});
    }
    else {
     //Actualizo los datos de la persona mostrada
     personas[idPersona].apellido=document.getElementById("apellido").value;
     personas[idPersona].nombre=document.getElementById("nombre").value;
     personas[idPersona].cuit=document.getElementById("cuit").value;
     personas[idPersona].dni=document.getElementById("dni").value;
     personas[idPersona].nroTramite=document.getElementById("nroTramite").value;
     personas[idPersona].telefono=document.getElementById("telefono").value;
     personas[idPersona].mail=document.getElementById("mail").value;
     personas[idPersona].direccion=document.getElementById("direccion").value;
     personas[idPersona].apellidoEmpleador=document.getElementById("apellidoEmpleador").value;
     personas[idPersona].nombreEmpleador=document.getElementById("nombreEmpleador").value;
     personas[idPersona].cuitEmpleador=document.getElementById("cuitEmpleador").value;     
     fs.writeFileSync(urlJsonPersonas, JSON.stringify(personas,null,4), 'utf8'); 
     M.toast({html: 'Datos Actualizado'});
     location.href = "gestorPersonas.html";
    }	
}

//Funcion que me elimina una persona
function eliminarPersona() {
    if (mostrarPersona==false) {
 	 M.toast({html: 'No se ha seleccionado ninguna persona'});
    }
    else {
     personas.splice(idPersona, 1); //Elimino 1 elemento, la posicion actual de visualizacion     
     fs.writeFileSync(urlJsonPersonas, JSON.stringify(personas,null,4), 'utf8'); 
     M.toast({html: 'Persona Eliminada'});
     location.href = "gestorPersonas.html";
    }
}

//Funcion que a partir de una imagen , genero el base 64
function base64_encode(file) {
 // read binary data
 var bitmap = fs.readFileSync(file);
 // convert binary data to base64 encoded string
 return new Buffer(bitmap).toString('base64');
}

//Funcion que hace la carga de las fotos
function subirImagen(file,elemento) {
 let input = file.target;
 let reader = new FileReader();
    reader.onload = function(){
     document.getElementById(elemento).src=reader.result;      
    };
    reader.readAsDataURL(input.files[0]);  
 
 //Obtengo el apellido y el nombre de la persona
 let apellido=document.getElementById("apellido").value;
 let nombre=document.getElementById("nombre").value;

    //Si el nombre o el apellido no estan definidos no puedo generar la imagen
    if ((apellido=="") && (nombre=="")) {
     M.toast({html: 'Debe tener seleccionada una persona, para asignarle una foto'});
    }
    else {
     //Genero la imagen en base 64
     let base64Data = base64_encode(input.files[0].path);
     //Genero el link de la imagen
     let linkImagen=`${process.env['directorioFotos']}${apellido}_${nombre}_${elemento}.jpg`;
     //Escribo el archivo 
     fs.writeFileSync(linkImagen, base64Data, 'base64');  
    }
}

//Funcion que me permite visualizarl los datos de una persona
function visualizarPersona(unaPersona,datosPersona,idPersonaSeleccionada) {
 let id=unaPersona.getAttribute("id");
 desactivarPersonasActivas(); //desactivo todos los activos
 unaPersona.setAttribute("class","collection-item active blue darken-3");
 //Cargo los datos en los Formularios
 document.getElementById("apellido").value=datosPersona.apellido;
 document.getElementById("nombre").value=datosPersona.nombre;
 document.getElementById("cuit").value=datosPersona.cuit;
 document.getElementById("dni").value=datosPersona.dni;
 document.getElementById("nroTramite").value=datosPersona.nroTramite;
 document.getElementById("telefono").value=datosPersona.telefono;
 document.getElementById("mail").value=datosPersona.mail;
 document.getElementById("direccion").value=datosPersona.direccion;
 document.getElementById("apellidoEmpleador").value=datosPersona.apellidoEmpleador;
 document.getElementById("nombreEmpleador").value=datosPersona.nombreEmpleador;
 document.getElementById("cuitEmpleador").value=datosPersona.cuitEmpleador;

 idPersona=idPersonaSeleccionada;
 //Activo mi bandera que me informa de que estoy mostrando a una persona
 mostrarPersona=true;
}

//Funcion que me genera el listado de personas
function listarPersonas(personas) {  
    if (personas.length>0) {
       //Recorro todo mi archivo de personas
	    for (let i=0; i < personas.length; i++) {
	     //Creo un elemento por cada persona en el listado
	     let a=document.createElement("a");
	     a.setAttribute("class","collection-item");
	     a.setAttribute("href","#");
	     a.setAttribute("id",i);
	     a.setAttribute("nombre",personas[i].nombre);
	     a.setAttribute("apellido",personas[i].apellido);
	     a.addEventListener("click",function(){visualizarPersona(a,personas[i],i)},false);
	     a.innerHTML=`<i class="tiny material-icons">account_box</i> ${personas[i].apellido}, ${personas[i].nombre}`;
	     contenedorListado.appendChild(a);
	    }
    }
    else {
     let p=document.createElement("p");
     p.innerHTML="No hay personas registradas en el sistema";
     contenedorListado.appendChild(p);
    }
}


//Funcion que visualiza el TAP de ayuda
function abrirCargaPersonas() {
 //M.toast({html: 'Usted quiere buscar un archivo'});
 //Abro el Modal
 var elems = document.getElementById('modal1');
 var instances = M.Modal.init(elems);
 var instance = M.Modal.getInstance(elems);
 instance.open(); // instance with methods

 //Genero el listado de Directorios para seleccionar
 var contenedorListadoSelectDirectorios=document.getElementById("listadoTrabajadoresBusqueda");
 //Genero el elemento por default
 /*<option value="default" disabled selected>Seleccione un Trabajador</option>*/
 let optionDefault=document.createElement("option");
 optionDefault.setAttribute("value","default");
 optionDefault.innerHTML="Seleccione un Trabajador";
 contenedorListadoSelectDirectorios.appendChild(optionDefault);

   //Itero para cada directorio generado
    for (let index=0; index < listadoDirectoriosTrabajadores.length; index++) {
      //Creo la opcion para el select
      let option=document.createElement("option");
      option.setAttribute("value",listadoDirectoriosTrabajadores[index]);
      option.innerHTML=listadoDirectoriosTrabajadores[index];
      contenedorListadoSelectDirectorios.appendChild(option);
    };
}

//Funcion que me permite registrar una nueva persona
function nuevaPersona() {
 let checkApellido=false;
 let checkNombre=false;
 let checkCuit=false;
 let checkDni=false;

    //Chequeo que al menos el apellido,el nombre,dni y el cuit no sean vacios
    if (document.getElementById("apellidoNew").value == "") {
     M.toast({html: 'Debe completar el Apellido de la Persona!'});
     checkApellido=false;
    }
    else { checkApellido=true;
    }

    if (document.getElementById("nombreNew").value == "") {
     M.toast({html: 'Debe completar el Nombre de la Persona!'});
     checkNombre=false;
    }
    else {
     checkNombre=true;
    }

    if (document.getElementById("cuitNew").value == "") {
     M.toast({html: 'Debe completar el Cuit de la Persona!'});
     checkCuit=false;
    }
    else {
     checkCuit=true;
    }

    if (document.getElementById("dniNew").value == "") {
     M.toast({html: 'Debe completar el DNI de la Persona!'});
     checkDni=false;
    }
    else {
     checkDni=true;
    }
   
    //Si todos los checks son verdaderos , defino a la nueva persona para agregarla
    if ((checkApellido==true) && (checkNombre==true) && (checkCuit==true) && (checkCuit==true)) {
        //Defino a la persona como un Array
        let nuevaPersona = {
         apellido: document.getElementById("apellidoNew").value,
         nombre: document.getElementById("nombreNew").value,
         dni: document.getElementById("dniNew").value,
         nroTramite: document.getElementById("nroTramiteNew").value,
         cuit: document.getElementById("cuitNew").value,
         telefono: document.getElementById("telefonoNew").value,
         mail: document.getElementById("mailNew").value,
         direccion: document.getElementById("direccionNew").value,
         apellidoEmpleador: document.getElementById("apellidoEmpleadorNew").value,
         nombreEmpleador: document.getElementById("nombreEmpleadorNew").value,
         cuitEmpleador: document.getElementById("cuitEmpleadorNew").value
        }
     //Agrego la nueva persona al Array del Json Personas
     personas.push(nuevaPersona);
     fs.writeFileSync(urlJsonPersonas, JSON.stringify(personas,null,4), 'utf8'); 
     M.toast({html: 'Nueva persona agregada al registro'});
     location.href = "gestorPersonas.html";  
    }
}

//Activo el listado
listarPersonas(personas);

