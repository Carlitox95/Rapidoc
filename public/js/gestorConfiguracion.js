//Declaro la funcion que me permite recorrer directorios
const fs = require('fs');
const fsUtils = require("nodejs-fs-utils");

//Obtengo el archivo JSON con los datos de las personas
let JSONpersonas = require('../public/json/registroPersonal.json');


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

//Funcion que me permite activar/desactivar un bloque de configuracion
function activarConfig(elementoHTMLConfig) {

	if (document.getElementById(elementoHTMLConfig).getAttribute("class")=="centrado oculto") {
     //Activo la visibilidad del contenedor
     document.getElementById(elementoHTMLConfig).setAttribute("class","centrado");
     //Cambio el mensaje del Spam que dice Mostrar/Ocultar
     document.getElementById(elementoHTMLConfig+"Span").innerHTML="Ocultar";
    }
    else {
     document.getElementById(elementoHTMLConfig).setAttribute("class","centrado oculto");
      //Cambio el mensaje del Spam que dice Mostrar/Ocultar
     document.getElementById(elementoHTMLConfig+"Span").innerHTML="Mostrar";
    }

}

//Funcion que me permite exportar los registros personales
function exportarRegistroPersonal(modalidadExportacion) {
    
    //Si se selecciono exportar como JSON
	if (modalidadExportacion=="JSON") {
     //Exporto el JSON
     exportToJsonFile(JSONpersonas);
	}
    
    //Si se selecciono exportar como CSV
	if (modalidadExportacion=="CSV") {
	 //Exporto como CSV
	 exportToCsvFile(JSONpersonas);
	}
 
 //Muestro un cartel informado que se ha exportado
 M.toast({html: 'Se ha exportado el registro personal'});
}

//Funcion que me permite exportar los registros personales como un JSON
function exportToJsonFile(jsonData) {
 //Obtengo la fecha actual
 let date = new Date();
 let fecha=date.toLocaleDateString();
 //Declaramos todas las variables
 let dataStr = JSON.stringify(jsonData,null,4);
 let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
 let exportFileDefaultName = 'RapiDoc_BackUp_RegistroPersonal_'+fecha+'.json';
 let linkElement = document.createElement('a');
 linkElement.setAttribute('href', dataUri);
 linkElement.setAttribute('download', exportFileDefaultName);
 linkElement.click();
}

//Funcion para formatear el JSONData como un CSV
function parseJSONToCSVStr(jsonData) {
    if(jsonData.length == 0) {
        return '';
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach(item => {
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length-1) ) {
                csvStr += columnDelimiter;
            }
            csvStr += item[key];
        });
        csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);;
}

//Funcion que me permite exportar los registros personales como un CSV
function exportToCsvFile(jsonData) {
 //Obtengo la fecha actual
 let date = new Date();
 let fecha=date.toLocaleDateString();
 //Declaramos todas las variables
 let csvStr = parseJSONToCSVStr(jsonData);
 let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;
 let exportFileDefaultName = 'RapiDoc_BackUp_RegistroPersonal_'+fecha+'.csv';
 let linkElement = document.createElement('a');
 linkElement.setAttribute('href', dataUri);
 linkElement.setAttribute('download', exportFileDefaultName);
 linkElement.click();
}

