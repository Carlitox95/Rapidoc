//Declaro la funcion que me permite recorrer directorios
const fs = require('fs');
const fsUtils = require("nodejs-fs-utils");

//Defino un Array para almacenar las lecturas de los directorios
let listadoDirectoriosTrabajadores=[];
       
//Funcion que me sirve para visualizar un archivo
function visualizarArchivo(elemento) { 
 var urlArchivo=elemento.getAttribute("id");  
 localStorage.setItem("verDocumento", JSON.stringify({pdf:urlArchivo}));
 location.href = "verPDF.html";  
}

//Funcion para restablecer el listado de todos los archivos de todos los directorios
function restablecerListado() {
 document.getElementById("contenedorArchivos").innerHTML=""; //vacio el contenedor
 document.getElementById("nombreDirectorio").innerHTML=""; //vacio el contenedor
 //Invoco a la funcion para que me genere el listado de archivos
 generarListadoArchivos();
}

//Funcion que elimina un directorio pasado por parametro (para los vacios)
function eliminarDirectorioVacio(directorio) {
 fsUtils.rmdirsSync(directorio);
 location.href = "gestorArchivos.html";  
}

//Funcion que me lista el contenido de un directorio
function listarDirectorio (directorio) {
 var directorioSeleccionado=directorio.getAttribute("directorio");
 //M.toast({html: 'Se mostraran los archivos del directorio:'+directorioSeleccionado});
 document.getElementById("contenedorArchivos").innerHTML=""; //vacio el contenedor
 document.getElementById("nombreDirectorio").innerHTML="de "+directorioSeleccionado;
 //Obtengo y declaro el contenedor al cual le voy a insertar los elementos HTML de los archivos
 var contenedorArchivos=document.getElementById("contenedorArchivos"); 
 let archivos=fs.readdirSync(process.env['directorioDocumentos']+directorioSeleccionado);  

    //Si hay trabajadores los trabajo , de lo contrario lo informo
    if (archivos.length > 0) {       
        for (let index=0; index < archivos.length; index++) { 
                //Solamente si estoy en la primera posicion del for , genero la estructura de la tabla
                if (index==parseInt(0)) {
                 //inserto la parte superior de la tabla en contenedorArchivos
                 let tabla=document.createElement("table");
                 tabla.setAttribute("class","striped centered highlight");
                 tabla.setAttribute("id","tablaElementosPersonal");
                 let thead=document.createElement("thead");
                 thead.setAttribute("class","blue lighten-2 white-text oculto");
                 let tr=document.createElement("tr");                 
                 let thFormulario=document.createElement("th");
                 let thAcciones=document.createElement("th");                 
                 thFormulario.innerHTML="Formulario";
                 thAcciones.innerHTML="Acciones";
                 //Inserto la tabla de adentro hacia afuera en su estructura                 
                 tr.appendChild(thFormulario);
                 tr.appendChild(thAcciones);
                 thead.appendChild(tr);
                 tabla.appendChild(thead);
                 //Creo el cuerpo de la tabla donde voy a insertar las tuplas e inserto
                 let tbody=document.createElement("tbody");
                 tbody.setAttribute("id","contenidoTablaElementosPersonal");
                 tabla.appendChild(tbody);   
                 contenedorArchivos.appendChild(tabla);                  
                }
             //Comienzo a generar uno a uno el TR y sus TD internos                
             let tbody=document.getElementById("contenidoTablaElementosPersonal");
             let trElemento=document.createElement("tr");             
             let tdElementoFormulario=document.createElement("td");
             let tdElementoAccion=document.createElement("td");
             let botonAccion=document.createElement("a");
             botonAccion.setAttribute("href","#");
             //botonAccion.setAttribute("class","waves-effect waves-light blue darken-3");
             botonAccion.setAttribute("id",directorioSeleccionado+"/"+archivos[index]);
             botonAccion.addEventListener("click",function(){visualizarArchivo(botonAccion)},false);
             botonAccion.innerHTML="<i class='material-icons' title='Ver Archivo'>visibility</i>";
             let imagenPdf=document.createElement("img");
             imagenPdf.setAttribute("src","../public/img/pdf.png");
             imagenPdf.setAttribute("class","imagenIconoPdf");
             //Inserto elemento a elemento que lleva la tupla del tr             
             tdElementoFormulario.innerHTML=archivos[index];
             tdElementoFormulario.appendChild(imagenPdf);
             tdElementoAccion.appendChild(botonAccion);            
             trElemento.appendChild(tdElementoFormulario);
             trElemento.appendChild(tdElementoAccion);
             tbody.appendChild(trElemento);                   
            
        };
    }
    else {
     //Como no hay archivos simplemente creo texto informando que no hay nada
     let p=document.createElement("p");
     let pContenido=document.createTextNode("No hay formularios generados");
     let p2=document.createElement("p");
     p2.innerHTML="¿Desea eliminar este directorio?";   
     p.appendChild(pContenido);
     let botonEliminar=document.createElement("button");
     botonEliminar.setAttribute("class","waves-effect waves-light btn-large red accent-4");
     botonEliminar.setAttribute("href","#!");
     botonEliminar.innerHTML="Eliminar Directorio Vacio";  
     botonEliminar.addEventListener("click",function(){eliminarDirectorioVacio(process.env['directorioDocumentos']+directorioSeleccionado)},false);   
     contenedorArchivos.appendChild(p);
     contenedorArchivos.appendChild(p2);
     contenedorArchivos.appendChild(botonEliminar);
    }
}


//Funcion que me genera el listado de directorios
function generarListadoDirectorios() {
 //obtengo el contenedor donde voy a generar el listado
 var contenedorDirectorios=document.getElementById("contenedorDirectorios");
 const directorio=process.env['directorioDocumentos'];
 //Obtengo todos los directorios del directorio general
 let directorios=fs.readdirSync(directorio); 
    //Si el directorio tiene algo, lo muestro
    if (parseInt(directorios.length) > parseInt(0)) {
       //Voy creando elemento HTML uno a uno
        for (let index=0; index < directorios.length; index++) {
         //Genero todo el contenido HTML
         let li=document.createElement("li");
         li.setAttribute("class","collection-item avatar");
         let a=document.createElement("a");
         a.setAttribute("href","#!");
         let img=document.createElement("img");
         img.setAttribute("class","circle");
         img.setAttribute("src","../public/img/archivoAnimado.png");
         img.setAttribute("directorio",directorios[index]);
         img.addEventListener('click',function() {listarDirectorio(img);},false);
         let span=document.createElement("span");
         span.setAttribute("span","title");
         span.innerHTML=directorios[index];
         //Obtengo la cantidad de archivos de ese directorio
         let directorioTrabajador=fs.readdirSync(directorio+directorios[index]);
         let p=document.createElement("p");
         p.innerHTML=directorioTrabajador.length+" archivos";         
         //Inserto los elementos HTML
         a.appendChild(img);
         li.appendChild(a);
         li.appendChild(span);
         li.appendChild(p);         
         contenedorDirectorios.appendChild(li);
         //Almaceno el Nombre del Directorio al Array de directorios
         listadoDirectoriosTrabajadores.push(directorios[index]);
        };
    }
    else {
     contenedorDirectorios.innerHTML="No hay directorios";
    }
}


//Funcion que me genera la visualizacion de todos los archivos del directorio
function generarListadoArchivos() {
 //Declaro el directorio de los formularios en una variable
 let directorio=process.env['directorioDocumentos'];
 //Obtengo los directorios para cada Trabajador del directorio
 let trabajadores=fs.readdirSync(directorio);  
 
 //Obtengo y declaro el contenedor al cual le voy a insertar los elementos HTML de los archivos
 let contenedorArchivos=document.getElementById("contenedorArchivos");
    //Si hay trabajadores los trabajo , de lo contrario lo informo
    if (trabajadores.length > 0) {
        //Para cada trabajador voy a obtener cada uno de sus archivos
        for (let index=0; index < trabajadores.length; index++) {       
         //Obtengo el directorio donde busco archivos para cada trabajador
         let directorioTrabajador=process.env['directorioDocumentos']+trabajadores[index]+"/";
      	 //Obtengo los archivos que existan para cada directorio
      	 let archivosTrabajador=fs.readdirSync(directorioTrabajador); 
         
      	    //Itero sobre los archivos obtenidos para generar el contenido HTML 
            for (let index2=0; index2 < archivosTrabajador.length; index2++) {                
             //Solamente si estoy en la primera posicion del for , genero la estructura de la tabla
                if ((index==parseInt(0)) && (index2==parseInt(0))) {
                 //inserto la parte superior de la tabla en contenedorArchivos
                 let tabla=document.createElement("table");
                 tabla.setAttribute("class","striped centered highlight");
                 tabla.setAttribute("id","tablaElementos");
                 let thead=document.createElement("thead");
                 thead.setAttribute("class","blue lighten-2 white-text oculto");
                 let tr=document.createElement("tr");
                 let thNombre=document.createElement("th");
                 let thFormulario=document.createElement("th");
                 let thAcciones=document.createElement("th");
                 thNombre.innerHTML="Directorio";
                 thFormulario.innerHTML="Formulario";
                 thAcciones.innerHTML="Acciones";
                 //Inserto la tabla de adentro hacia afuera en su estructura
                 tr.appendChild(thNombre);
                 tr.appendChild(thFormulario);
                 tr.appendChild(thAcciones);
                 thead.appendChild(tr);
                 tabla.appendChild(thead);
                 //Creo el cuerpo de la tabla donde voy a insertar las tuplas e inserto
                 let tbody=document.createElement("tbody");
                 tbody.setAttribute("id","contenidoTablaElementos");
                 tabla.appendChild(tbody);   
                 contenedorArchivos.appendChild(tabla);  
                }
             //Comienzo a generar uno a uno el TR y sus TD internos                
             let tbody=document.getElementById("contenidoTablaElementos");
             let trElemento=document.createElement("tr");
             let tdElementoNombre=document.createElement("td");
             let tdElementoFormulario=document.createElement("td");
             let tdElementoAccion=document.createElement("td");
             let botonAccion=document.createElement("a");
             botonAccion.setAttribute("href","#");
             //botonAccion.setAttribute("class","waves-effect waves-light blue darken-3");
             botonAccion.setAttribute("id",trabajadores[index]+"/"+archivosTrabajador[index2]);
             botonAccion.addEventListener("click",function(){visualizarArchivo(botonAccion)},false);
             botonAccion.innerHTML="<i class='material-icons' title='Ver Archivo'>visibility</i>";
             let imagenPdf=document.createElement("img");
             imagenPdf.setAttribute("src","../public/img/pdf.png");
             imagenPdf.setAttribute("class","imagenIconoPdf");
             //Inserto elemento a elemento que lleva la tupla del tr
             tdElementoNombre.innerHTML=trabajadores[index];
             tdElementoFormulario.innerHTML=archivosTrabajador[index2];
             tdElementoFormulario.appendChild(imagenPdf);
             tdElementoAccion.appendChild(botonAccion);
             trElemento.appendChild(tdElementoNombre);
             trElemento.appendChild(tdElementoFormulario);
             trElemento.appendChild(tdElementoAccion);
             tbody.appendChild(trElemento);                 
            };
        };
    }
    else {
     //Como no hay archivos simplemente creo texto informando que no hay nada
     let p=document.createElement("p");
     p.innerHTML="No hay formularios generados";     
     contenedorArchivos.appendChild(p);
    }
}

//Invoco a la funcion para que me genere el listado de directorios
generarListadoDirectorios();
//Invoco a la funcion para que me genere el listado de archivos
generarListadoArchivos();


