//Defino las variables que voy a utilizar
const fs = require('fs');
const pdf = require('html-pdf');

//Obtengo el archivo con los datos de las personas
let personas = require('../public/json/registroPersonal.json');

//Ordeno el Json por los apellidos de personas
personas = ordenarJSON(personas, 'apellido', 'asc');

//Defino las opciones del PDF a generar
var options = {
 //"height": "229mm",      
 //"width": "214mm",
 "type": "pdf", // allowed file types: png, jpeg, pdf
 "quality": "100",
 "border": "0",
 "format": "A3",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
 "orientation": "portrait", // portrait or landscape
 "base": __dirname,
};

//Defino la carga de mi fondo
let fondo931="";

//Levanto mi JSON con los documentos disponibles
const jsonDocumentos = require('../public/json/jsonDocumentos.json');

  //Itero sobre todos los documentos hasta encontrar el que corresponde al actual
  for (let index=0; index < jsonDocumentos.length; index++) {     
    //Si el documento actual es el que busco trabajo con los datos
    if (jsonDocumentos[index].codigoFormulario=="931") {
     fondo931=jsonDocumentos[index].plantillaPdf;
    }
  }

///////////////////////////////////////////////////////////////////
//////////////////////////// Funciones ////////////////////////////
///////////////////////////////////////////////////////////////////

//Funcion que activa y desactiva pantalla de carga
function activarPantallaCarga() {
 document.getElementById("pantallaCarga").setAttribute("class","col s12");
}
 
//Funcion que me desactiva la pantalla de carga
function desactivarPantallaCarga() {
 document.getElementById("pantallaCarga").setAttribute("class","col s12 oculto");
}
 
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
 
//Funcion que me desactiva un elemento del listado
function desactivarPersonasActivas() {
 let elementos=document.getElementById("listadoPersonas").getElementsByClassName("collection-item");
    //Le saco la clase active a todos los elementos
    for (let i=0; i < elementos.length; i++) {
     elementos[i].setAttribute("class","collection-item");
    }
 }
 
//Funcion que me carga previamente los datos de la persona guardada
function cargarPersona(elemento,unaPersona,idPersona) {
 //Cargo los valores en el Formulario
 document.getElementById("apellidoTrabajador").value=unaPersona.apellido;
 document.getElementById("nombreTrabajador").value=unaPersona.nombre;
 document.getElementById("cuitPersona").value=unaPersona.cuit;
 //Desactivo todas las personas del listado
 desactivarPersonasActivas();
 //Muestro a la persona del listo como activa
 elemento.setAttribute("class","collection-item active blue lighten-2");
}
 
 
//Funcion que me genera el listado de personas
function listarPersonas() {  
 //Obtengo el contenedor donde cargo el listado
 let contenedorListado=document.getElementById("listadoPersonas");
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
         a.addEventListener("click",function(){cargarPersona(a,personas[i],i)},false);
         a.innerHTML=`<i class="tiny material-icons left">account_box</i> ${personas[i].apellido}, ${personas[i].nombre}`;
         contenedorListado.appendChild(a);
        }
    }
    else {
     let p=document.createElement("p");
     p.innerHTML="No hay personas registradas en el sistema";
     contenedorListado.appendChild(p);
    }
}
 

//Funcion que me activa la opcion de los intereses resarcitorios 
function activarInteresesResarcitorios() {
    //Si se activa el check, activo el input  
    if (document.getElementById("checkIntereses").checked==true) {
     document.getElementById("InteresesResarcitorios").disabled = false;
     M.toast({html: 'Activo los intereses Resarcitorios por Diferenca de Contribuciones'});  
    }
    else {
     document.getElementById("checkIntereses").checked=false;
     document.getElementById("InteresesResarcitorios").disabled = true;
     M.toast({html: 'Desactivo los intereses Resarcitorios por Diferenca de Contribuciones'}); 
    } 
}

//Funcion que me retorna un array con el detalle de los periodos a partir de la fecha de inicio y fin
function calcularPeriodos (fechaInicio,fechaFin) {
 //Obtengo los datos del mes1_anio1 y mes2_anio2
 const mesPeriodo1=fechaInicio.slice(0,2); //boleta.fechaInicio -> mm/aaaa
 const anioPeriodo1=fechaInicio.slice(3,7);
 const mesPeriodo2=fechaFin.slice(0,2);
 const anioPeriodo2=fechaFin.slice(3,7);
 const periodosGenerados=((parseInt(anioPeriodo2)-parseInt(anioPeriodo1))* parseInt(12))+(parseInt(mesPeriodo2)-parseInt(mesPeriodo1))+(parseInt(1));
 
 //Defino mi Array donde voy a ir almacenando los periodos
 let arrayPeriodos=[]; //mes,anio
 let mesFormulario=mesPeriodo1;
 let anioFormulario=anioPeriodo1;
 var incrementador=0;
  
    //Realizo las n iteraciones para generar los n periodos que necesito
    for (let index=0; index < periodosGenerados; index++) {      
     let mes=parseInt(mesFormulario)+parseInt(incrementador); 
     //Si me paso del mes 12, le resto 12 para asegurarme volver al mes 1, seteo el incrementador en 0      
        if (mes>12) {
         mes=parseInt(mes)-12;
         incrementador=0;
         anioFormulario=parseInt(anioFormulario)+1;
        }     
     //Me aseguro que cada mes tengo 2 caracteres para completar el formulario
     if (mes<10) { mes="0"+String(mes); } else { mes=String(mes); }    
     anioFormulario=String(anioFormulario);
     arrayPeriodos[index]=[mes,anioFormulario];
     incrementador++;
    };
 return arrayPeriodos;
}




//Funcion que verifica los parametros del formulario
function validarParametros(boleta) {
    //Verifico el apellido
    if (boleta.apellido=="") {
     M.toast({html: 'Debe completar el Apellido'});
     return false;
    }
    //Verifico el nombre
    if (boleta.nombre=="") {
     M.toast({html: 'Debe completar el Nombre'});
     return false;   
    }
    //Verifico cuit Empleado
    if (boleta.cuitPersona=="") {
     M.toast({html: 'Debe completar el cuit del Empleado'});
     return false;   
    }
    else {
     //Verifico que no falten los guiones ej: xx-xxxxxxxx-x
        if ((boleta.cuitPersona[2] !== "-") || (boleta.cuitPersona[11] !== "-")) {
         M.toast({html: 'Debe completar el cuit con los guiones. Ejemplo: xx-xxxxxxxx-x'});
         return false;
        }   
    }
  
    //Verifico el periodo
    if (boleta.mes=="default") {
     M.toast({html: 'Debe completar el mes del Periodo'});
     return false;   
    }
  
    //Verifico el periodo
    if (boleta.anio=="") {
     M.toast({html: 'Debe completar el año del Periodo'});
     return false;   
    }
   

 //Como llegue hasta aca y no hubo problemas , retorno true
 return true;
}

//Funcion que dado un string me retorna,la primer letra en mayusculas
function inicioCadenaMayusculas(cadena) {
 const primerCaracter = cadena.charAt(0).toUpperCase();
 const restoDeLaCadena = cadena.substring(1, cadena.length);
 return primerCaracter.concat(restoDeLaCadena);
}


//Funcion para generar el PDF
function generarPDF(modoEjecucion) {
 //Obtengo los datos
 var apellidoForm=inicioCadenaMayusculas(document.getElementById("apellidoTrabajador").value);
 var nombreFrom=inicioCadenaMayusculas(document.getElementById("nombreTrabajador").value);
 var cuitPersona=document.getElementById("cuitPersona").value;
 var mesPeriodo=document.getElementById("mesPeriodo").value;
 var anioPeriodo=document.getElementById("anioPeriodo").value; 
 var nroVerificador=document.getElementById("nroVerificador").value; 
 var aportesSSPagar=document.getElementById("aportesSSPagar").value; 
 var contribucionesSSPagar=document.getElementById("contribucionesSSPagar").value; 
 var aporteOSPagar=document.getElementById("aporteOSPagar").value; 
 var contribucionesOSPagar=document.getElementById("contribucionesOSPagar").value; 
 var valesAlimentariosCajasAlimentos=document.getElementById("valesAlimentariosCajasAlimentos").value; 
 var leyRiesgosTrabajo=document.getElementById("leyRiesgosTrabajo").value; 

 //Genero un Objeto con los datos de este formulario
 var boleta = new Object();
 boleta.apellido=apellidoForm;
 boleta.nombre=nombreFrom;
 boleta.cuitPersona=cuitPersona;
 boleta.mes=mesPeriodo;
 boleta.anio=anioPeriodo; 
 boleta.nroVerificador=nroVerificador;
 boleta.aportesSSPagar=aportesSSPagar;
 boleta.contribucionesSSPagar=contribucionesSSPagar;
 boleta.aporteOSPagar=aporteOSPagar;
 boleta.contribucionesOSPagar=contribucionesOSPagar;
 boleta.valesAlimentariosCajasAlimentos=valesAlimentariosCajasAlimentos;
 boleta.leyRiesgosTrabajo=leyRiesgosTrabajo



  
 //valido los parametros con mi funcion de check
 var condicionPdf=validarParametros(boleta);  

    //Verifico que todas las condiciones esten dadas para seguir
    if (condicionPdf==false) {
     M.toast({html: 'No se puede crear el formulario debido a que hay campos incompletos y/o erroneos'});
    }
    else {  
     //Si el modo de ejecucion es unico , genero solo un PDF
     activarPantallaCarga();
     //Llamo a la funcion que me genera el codigo HTML
     var contenidoHTML=generarContenido(boleta);
     //Defino el nombre para guardar el formulario de Pago
     var linkArchivo=process.env['directorioDocumentos']+apellidoForm+","+nombreFrom+"/F931-"+anioPeriodo+"_"+mesPeriodo+".pdf";
     //Proceso a generar el archivo
        pdf.create(contenidoHTML,options).toFile(linkArchivo, function(err, res) {
            if (err){
             M.toast({html: 'No se pudo generar el formulario. Error:'+err})
            }
            else {                
             //Imprimo un mensaje avisando que se genero el documento
             M.toast({html: 'El formulario ha sido generado de forma exitosa!'})                 
            }
         desactivarPantallaCarga(); 
        });    
    } 
}

//Funcion que me sirve para generar el contenido de los PDF
function generarContenido(boleta) {
 //Version donde importo el codigo del formulario desde otro lado
 //var contenidoHTML = fs.readFileSync('./formularios_base/f575b.html',{encoding:'utf8', flag:'r'});
 //return contenidoHTML;

 var contenidoHTML=`
 <!-- Inicia el HTML del PDF -->
 <!DOCTYPE html>
 <html xmlns='http://www.w3.org/1999/xhtml' lang='' xml:lang=''>
 <head>
 <title>Page 1</title>
 <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/> 
 <style type='text/css'>
  p {margin: 0; padding: 0;}	
  .ft00{font-size:12px;font-family:ORIDKM+Arial;color:#2b2728;}
  .ft01{font-size:11px;font-family:ORIDKM+Arial;color:#2b2728;}
  
 </style>
 </head>
 <body vlink='blue' link='blue'>
 <div id='page1-div' style='position:relative;width:918px;height:1100px;'>
 <img width='918' height='1188' src=${fondo931} alt='background image'/>

 <!-- Periodo -->
 <p style='position:absolute;top:45px;left:600px;white-space:nowrap' class='ft00'><b>${boleta.mes}</b></p>
 <p style='position:absolute;top:45px;left:640px;white-space:nowrap' class='ft00'><b>${boleta.anio}</b></p>
 <!-- Periodo -->

 <!-- CUIT -->
 <p style='position:absolute;top:98px;left:600px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[0]}</b></p>
 <p style='position:absolute;top:98px;left:620px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[1]}</b></p>
 <p style='position:absolute;top:98px;left:640px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[2]}</b></p>
 <p style='position:absolute;top:98px;left:660px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[3]}</b></p>
 <p style='position:absolute;top:98px;left:680px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[4]}</b></p>
 <p style='position:absolute;top:98px;left:700px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[5]}</b></p>
 <p style='position:absolute;top:98px;left:720px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[6]}</b></p>
 <p style='position:absolute;top:98px;left:740px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[7]}</b></p>
 <p style='position:absolute;top:98px;left:760px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[8]}</b></p>
 <p style='position:absolute;top:98px;left:780px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[9]}</b></p>
 <p style='position:absolute;top:98px;left:800px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[10]}</b></p>
 <p style='position:absolute;top:98px;left:820px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[11]}</b></p>
 <p style='position:absolute;top:98px;left:840px;white-space:nowrap' class='ft00'><b>${boleta.cuitPersona[12]}</b></p>
 <!-- CUIT -->

 <!-- Apellido y nombre o Razon Social -->
 <p style='position:absolute;top:190px;left:405px;white-space:nowrap' class='ft01'><b>${boleta.apellido} ${boleta.nombre}</b></p>
 <!-- Apellido y nombre o Razon Social -->

 <!-- Numero de Verificador -->
 <p style='position:absolute;top:190px;left:750px;white-space:nowrap' class='ft01'><b>${boleta.nroVerificador}</b></p>
 <!-- Numero de Verificador -->

 <!-- Regimen Nacional de Seguridad Social -->
 <!-- Aportes SS a Pagar -->
 <p style='position:absolute;top:345px;left:300px;white-space:nowrap' class='ft01'><b>${boleta.aportesSSPagar}</b></p>
 <!-- Contribuciones SS a Pagar -->
 <p style='position:absolute;top:510px;left:300px;white-space:nowrap' class='ft01'><b>${boleta.contribucionesSSPagar}</b></p>

 <!-- Regimen Nacional de Obras Sociales -->
 <!-- Aportes OS a Pagar -->
 <p style='position:absolute;top:345px;left:750px;white-space:nowrap' class='ft01'><b>${boleta.aporteOSPagar}</b></p>
 <!-- Contribuciones OS a Pagar -->
 <p style='position:absolute;top:465px;left:750px;white-space:nowrap' class='ft01'><b>${boleta.contribucionesOSPagar}</b></p> 
 <!-- Vales Alimentarios y Cajas de Alimentos -->
 <p style='position:absolute;top:660px;left:750px;white-space:nowrap' class='ft01'><b>${boleta.valesAlimentariosCajasAlimentos}</b></p> 
 <!-- Ley de Riesgos de Trabajo -->
 <p style='position:absolute;top:765px;left:750px;white-space:nowrap' class='ft01'><b>${boleta.leyRiesgosTrabajo}</b></p> 

 </div> 
 </body>
 </html>

 <!-- Termina el HTML del PDF -->
 `;
 return contenidoHTML;
}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////// Codigo de Ejecucion ////////////////////////////
/////////////////////////////////////////////////////////////////////////////

//Invoco a la funcion para listar las personas
listarPersonas();