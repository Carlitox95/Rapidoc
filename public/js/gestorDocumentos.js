//Modulos requeridos por la aplicacion
const fs = require('fs');

//Levanto mi JSON con los documentos disponibles
const jsonDocumentos = require('../public/json/jsonDocumentos.json');

//Funcion para listar los documentos disponibles
function listarDocumentos(documentosDisponibles){
 //Obtengo el contenedor donde voy a acoplar el listado
 let contenedorListado=document.getElementById("listadoDocumentosDisponibles");  
    //Creo cada elemento iterando sobre el array de elementos
    for (let index=0; index < documentosDisponibles.length; index++) {
     //Creo el LI
     let liCustom=document.createElement("li");
     liCustom.setAttribute("class","collection-item");
     liCustom.addEventListener("click",function(){visualizarDocumento(documentosDisponibles[index])},false);
     liCustom.innerHTML="<i class='material-icons left'>info</i>";
     //Defino el nombre del Documento
     let documentCustom=documentosDisponibles[index].titulo;
     //Creo el Div
     let divCustom=document.createElement("li");
     //Creo el A (enlace)
     let aCustom=document.createElement("a");
     aCustom.setAttribute("class","secondary-content");
     aCustom.setAttribute("href",documentosDisponibles[index].vista);
     aCustom.innerHTML="<i class='material-icons'>edit</i>";

     //Inserto cada enlace de documento generado al listado
     divCustom.innerHTML=documentCustom;
     divCustom.appendChild(aCustom);
     liCustom.appendChild(divCustom);
     contenedorListado.appendChild(liCustom);     
    }
}

//Funcion para mostrar la vista previa del documento
function visualizarDocumento(arrayDocumento) {
 document.getElementById("imagenPreviaDocumento").setAttribute("src",arrayDocumento.imagen);
 document.getElementById("infoDocumento").innerHTML=arrayDocumento.detalle;
 document.getElementById("CategoriaDocumento").innerHTML=arrayDocumento.categoria;
}



//Invoco a la funcion para generar el listado de documentos para generar
listarDocumentos(jsonDocumentos);