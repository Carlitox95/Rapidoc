//Declaro la funcion que me permite recorrer directorios
const fs = require('fs');
const fsUtils = require("nodejs-fs-utils");


//Obtengo el archivo con los datos de las personas
let personas = require('../public/json/registroPersonal.json');

//Ordeno el Json por los apellidos de personas
personas = ordenarJSON(personas, 'apellido', 'asc');

//Obtenemos todos los tipos de Formularios
let JsonDocumentos = require('../public/json/JsonDocumentos.json');

//Defino un array para tener todos los tipos de formularios posibles
let arrayTipoDocumentos=[];

    //Obtengo todos codigos de formularios
    for (let i=0; i < JsonDocumentos.length; i++) { 
      arrayTipoDocumentos.push(JsonDocumentos[i].codigoFormulario.toUpperCase());    
    }

    //Quito posibles repetidos de mi array de tipo de formularios
    arrayTipoDocumentos = arrayTipoDocumentos.filter((valor, indice) => {
         return arrayTipoDocumentos.indexOf(valor) === indice;
        }
    );


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
function listarPersonas() {
 //Obtengo el contenedor donde cargo el listado
 let contenedorListado=document.getElementById("listadoPersonas");
 
    //Genero un elemento de persona por cada IDS encontrado en la busqueda
    for (let i=0; i < personas.length; i++) {
     let idPersona= personas[i]; //Asigno el ID actual
    
     //Creo el elemento de la persona
     let a=document.createElement("a");
     a.setAttribute("class","collection-item");
     a.setAttribute("href","#");
     a.setAttribute("id",i);
     a.setAttribute("nombre",personas[i].nombre);
     a.setAttribute("apellido",personas[i].apellido);
     a.addEventListener("click",function(){activarSeguimiento(personas[i])},false);
     a.innerHTML=`<i class="tiny material-icons">account_box</i> ${personas[i].apellido}, ${personas[i].nombre}`;
     contenedorListado.appendChild(a);
    } 
    if (personas.length==0) {
     let p=document.createElement("p");
     p.innerHTML="No se han encontrado coincidencias";
     contenedorListado.appendChild(p);
    }
}

//Funcion que me retorna el total de archivos de un directorio
function obtenerCantidadTotalDirectorio(persona) {
 //Determino el directorio de la Persona seleccionada
 let directorioSeleccionado=persona.apellido+","+persona.nombre;
  
    //Verifico que exista el directorio
    if (fs.existsSync(process.env['directorioDocumentos']+directorioSeleccionado)) {
     //Abro el directorio
     let archivos=fs.readdirSync(process.env['directorioDocumentos']+directorioSeleccionado);    	
     return archivos.length;
    }
    else {
     return 0;
    }

}


//Funcion que me retorna la cantidad de archivos de un tipo
function obtenerCantidadTipoArchivo(tipoArchivo,persona) {
 //Determino el directorio de la Persona seleccionada
 let directorioSeleccionado=persona.apellido+","+persona.nombre;
  
    //Verifico que exista el directorio
    if (fs.existsSync(process.env['directorioDocumentos']+directorioSeleccionado)) {
     //Abro el directorio
     let archivos=fs.readdirSync(process.env['directorioDocumentos']+directorioSeleccionado); 
   	 let cantidadArchivosTipo=0;

   	    //Itero sobre todos los archivos
   	    for (let i=0; i < archivos.length; i++) { 
            
            //Si el archivo contiene en el nombre el tipo de archivo lo cuento...
            if (archivos[i].indexOf(tipoArchivo) != -1 ) {
              cantidadArchivosTipo++;
            }
   	    }
     return cantidadArchivosTipo;
    }
    else {
     return 0;
    }
}


//Funcion que activa el seguimiento
function activarSeguimiento (persona) {
 //Obtengo el contenedor donde voy a crear el contenido del seguimiento
 let contenedorSeguimiento=document.getElementById('cajaSeguimiento');
 //Vaciamos el seguimiento anterior
 document.getElementById('cajaSeguimiento').innerHTML="";     

 //Obtenemos los datos del seguimiento
 let nroCantidadArchivos= obtenerCantidadTotalDirectorio(persona);  

 //Creo el titulo del seguimiento
 let titulo=document.createElement("h5");
 titulo.setAttribute("class","titulo");
 titulo.innerHTML="<center> Seguimiento de "+persona.apellido+","+persona.nombre+"</center>";
 contenedorSeguimiento.appendChild(titulo);

 //Creo la caja para los datos
 let cajaDatos=document.createElement("div");
 cajaDatos.setAttribute("class","collection");

 //Creo los datos a mostrar en la caja de datos
 let cantidadDeArchivos=document.createElement("li");
 cantidadDeArchivos.setAttribute("class","collection-item light-blue darken-3 white-text");
 cantidadDeArchivos.innerHTML="<span class='new badge'>"+nroCantidadArchivos+"</span> Total de Documentos Generados";

 cajaDatos.appendChild(cantidadDeArchivos);
 
    
    //Por cada tipo de archivo voy a determinar la cantidad de cada uno
    for (let i=0; i < arrayTipoDocumentos.length; i++) { 
     //Obtengo la cantidad de archivos del primer tipo
     let nroCantidadArchivosTipo=obtenerCantidadTipoArchivo(arrayTipoDocumentos[i],persona);
     //Creo el elemento para mostrar la cantidad
     let cantTipoDocumento=document.createElement("li");
     cantTipoDocumento.setAttribute("class","collection-item light-blue darken-1 white-text");
     cantTipoDocumento.setAttribute("id",arrayTipoDocumentos[i]);
     cantTipoDocumento.innerHTML="<span class='new badge'>"+nroCantidadArchivosTipo+"</span> Formularios "+arrayTipoDocumentos[i];
     //Inserto el elemento en la caja de datos
     cajaDatos.appendChild(cantTipoDocumento);
    }

 //Inserto la caja de Datos
 contenedorSeguimiento.appendChild(cajaDatos);
}


//Activo el listado
listarPersonas();