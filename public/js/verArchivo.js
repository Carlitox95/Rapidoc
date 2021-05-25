//Requiero el modulo de Filesystems
const fs = require('fs');

//Funcion que me devuelve al menu anterior
function volverAtras() {
 location.href = "gestorArchivos.html"; 
}

//Funcion para borrar un archivo
function borrarArchivo() {
 fs.unlinkSync(process.env['directorioDocumentos']+pdfFormulario); 
 location.href = "gestorArchivos.html"; 
}

//Obtengo el nombre de archivo que paso desde los formularios
const archivo = JSON.parse(localStorage.getItem('verDocumento'));
const pdfFormulario=archivo.pdf;

//Creo un elemento iframe para mostrar el PDF
var contenedorIframe=document.getElementById("contenedorIframe");
var iframe=document.createElement("iframe");
iframe.setAttribute("type","application/pdf");
iframe.setAttribute("width","90%");
iframe.setAttribute("height","100%");
//Como esta empaquetado la dura estricta no es lo mismo y es necesario volver 3 directorios hacia atras
iframe.setAttribute("src","."+process.env['directorioDocumentos']+pdfFormulario);
contenedorIframe.appendChild(iframe);