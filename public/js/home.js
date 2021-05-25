//Requiero los modulos necesarios
const directorioRaiz=process.env['directorioDocumentos'];
const Chart=require("chart.js");
const fs = require('fs');
var fsUtils = require("nodejs-fs-utils");

//Almaceno los tamaños de los directorios
const FACTOR_CONVERTION_TO_MB = 0.000001;
let subDirectoriosRaiz=fs.readdirSync(directorioRaiz);  

//Funcion que me genera un color de forma alteatoria
function getRandomColor() {
 var letters = '0123456789ABCDEF';
 var color = '#';
  for (var i = 0; i < 6; i++) {
   color += letters[Math.floor(Math.random() * 16)];
  }
 return color;
}

//Funcion que cambia el formato de fechas del fileSystem por el formato local
function formatearFechas(unFecha) { 
 let arrayfecha= unFecha.split(' '); //divido la fecha por los espacios vacios
 var anio=arrayfecha[3];
 var mes=arrayfecha[1];
 var dia=arrayfecha[2];
 let fechaConFormato = new Date(anio+"/"+mes+"/"+dia);
 return fechaConFormato; 
}


//Funcion que me determina todas la fechas de creacion de todos los archivos del directorio
function obtenerDatosXFechas(directorio) {
 let arrayArchivosXFecha=[]; //Defino un array archivos y su fecha de creacion
 //Obtengo todos los sub directorios
 let subDirectorios=fs.readdirSync(directorio); 
    //Verifico que existan subdirectorios
    if (subDirectorios.length > 0) {         
        //Recorro c/u de los subdirectorios archivos por archivo
        for (let indexSubDirectorio=0; indexSubDirectorio < subDirectorios.length; indexSubDirectorio++) { 
         let subDirectorioActual=directorio+subDirectorios[indexSubDirectorio]+"/";     
         let archivosSubDirectorio=fs.readdirSync(subDirectorioActual); 
            //Verifico que el subdirectorio tenga archivos
            if (archivosSubDirectorio.length) {
                //Recorro archivo x archivo 
                for (let indexArchivo=0; indexArchivo < archivosSubDirectorio.length; indexArchivo++) { 
                 let archivoActual=subDirectorioActual+archivosSubDirectorio[indexArchivo];
                 let fechaArchivo= String(fs.statSync(archivoActual).birthtime);
                 let fechaCreacion = fechaArchivo.substring(0,15);                              
                 //Defino un objeto para almacenar informacion
                 var archivoStats = new Object();
                 archivoStats.nombreArchivo=archivoActual;
                 archivoStats.fechaCreacion= formatearFechas(fechaCreacion);
                 //Inserto el objeto en mi array de archivos
                 arrayArchivosXFecha.push(archivoStats);               
                }
            }
        }
    }
    
    //Defino acomuladores para cada mes
    let cantEnero=0;
    let cantFebrero=0;
    let cantMarzo=0;
    let cantAbril=0;
    let cantMayo=0;
    let cantJunio=0;
    let cantJulio=0;
    let cantAgosto=0;
    let cantSeptiembre=0;
    let cantOctubre=0;
    let cantNoviembre=0;
    let cantDiciembre=0;

    //Tengo que traerme los archivos ordenados en el ultimo año
    for (let index=0; index <arrayArchivosXFecha.length; index++) { 
      //Obtengo el año actual
      let fechaActual= new Date();
      let anioActual= fechaActual.getFullYear(); 
      //obtengo el año 
      let anioArchivo=arrayArchivosXFecha[index].fechaCreacion.getFullYear(); 
      let mesArchivo=arrayArchivosXFecha[index].fechaCreacion.getMonth();      
      
        //Mientras el año de creacion sea el mismo que el año actual sigo..
        if (anioActual == anioArchivo) {
            switch (mesArchivo) {
                case 1:
                 cantEnero++;
                 break;
                case 2:
                 cantFebrero++;
                 break;
                case 3:
                 cantMarzo++;
                 break;
                case 4:
                 cantAbril++;
                 break;
                case 5:
                 cantMayo++;
                 break;
                case 6:
                 cantJunio++;
                 break;
                case 7:
                 cantJulio++;
                 break;
                case 8:
                 cantAgosto++;
                 break;
                case 9:
                 cantSeptiembre++;
                 break;
                case 10:
                 cantOctubre++;
                 break;
                case 11:
                 cantNoviembre++;
                 break;
                case 12:
                 cantDiciembre++;
                break;
            }          
        }    
    } 
  
  //Defino un array con los archivos generados x meses
  let arrayCantXMeses=[cantEnero,cantFebrero,cantMarzo,cantAbril,cantMayo,cantJulio,cantAgosto,cantSeptiembre,cantOctubre,cantNoviembre,cantDiciembre];

 return arrayCantXMeses;
}


//Funcion que me calcula las estadisticas de los directorios
function obtenerEstadisticasDirectorios(){
 let statsDirectorios=[];
 let directorios=fs.readdirSync(directorioRaiz); //Obtengo todos los subdirectorios   
    //Para cada directorio genero un objeto
    for (let index=0; index < directorios.length; index++) {
      const directorioActual=directorioRaiz+directorios[index];
      //Calculo el tamaño de los directorisos
      var directorio = new Object();      
      //Obtengo el nombre del directorio actual
      directorio.nombre=directorios[index]; 
      //Obtengo la cantidad de Archivos del directorio actual
      directorio.cantArchivos=fs.readdirSync(directorioActual).length; 
      //Obtengo el tamaño en MB del directorio actual
       if (fs.existsSync(directorioActual) && ((fs.lstatSync(directorioActual).isFile() || fs.lstatSync(directorioActual).isDirectory()))) {
         var size = fsUtils.fsizeSync(directorioActual);  
         directorio.tam=(parseFloat(size)*parseFloat(FACTOR_CONVERTION_TO_MB)).toFixed(2);
         //Guardo la informacion
         statsDirectorios.push(directorio);
        }
    };
 return statsDirectorios;
}


//Funcion que me genera el grafico del canvas con los tamaños del directorio
function generarCanvasTam(directorios) {
 //Creo el grafico
 var canvas = document.getElementById("canvasDirectoriosTam"); 
 let names= [];
 let sizes= [];
 let backgroundColors = [];
    for (let i=0; i<directorios.length; i++) {   
     names.push(directorios[i].nombre+" (MB)");
     sizes.push(directorios[i].tam);
     backgroundColors.push(getRandomColor());
    };
    const datosDirectorios = { 
     labels: names,
     datasets: [ { data: sizes, backgroundColor: backgroundColors }]
    };
 var canvas = new Chart(canvas, { type: 'pie', data: datosDirectorios });
}

//Funcion que me genera el grafico del canvas con los tamaños del directorio
function generarCanvasXCantidadArchivos(directorios) {
    //Creo el grafico
    var canvas = document.getElementById("canvasDirectoriosCantidadArchivos"); 
    let names= [];
    let cants= [];
    let backgroundColors = [];
       for (let i=0; i<directorios.length; i++) {   
        names.push(directorios[i].nombre);
        cants.push(directorios[i].cantArchivos);
        backgroundColors.push(getRandomColor());
       };
       const datosDirectorios = { 
        labels: names,
        datasets: [ { data: cants, backgroundColor: backgroundColors }]
       };
    var canvas = new Chart(canvas, { type: 'bar', data: datosDirectorios});
}
//Funcion que genera grafico por meses
function generarCanvasXMeses(arrayCantXMeses) {    
 //Creo el grafico
 var canvas = document.getElementById("canvasDirectoriosxMeses"); 
 let meses= ["Enero","Febrero","Marzo","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
 let cants= [];
 let backgroundColors = [];
        for (let i=0; i<arrayCantXMeses.length; i++) {           
         cants.push(arrayCantXMeses[i]);
         backgroundColors.push(getRandomColor());
        };
        const datosDirectorios = { 
         labels: meses,
         datasets: [ { data: cants, backgroundColor: backgroundColors }]
         
        };
    
    var canvas = new Chart(canvas, { type: 'line', data: datosDirectorios});
}

//Obtengo datos estadisticos de los directorios
let statsDirectorios=obtenerEstadisticasDirectorios(directorioRaiz);
//Obtengo datos estadisticos por fecha de creacion de los archivos
let arrayArchivosStats= obtenerDatosXFechas(directorioRaiz);

generarCanvasTam(statsDirectorios); //Genero el Canvas por tamaño de archivos en disco
generarCanvasXCantidadArchivos(statsDirectorios); //Genero canvas por cantidad de archivos
generarCanvasXMeses(arrayArchivosStats); //Genero el canvas por cant de archivos por mes
