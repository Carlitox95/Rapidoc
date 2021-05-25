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
let fondoF575rt="";

//Levanto mi JSON con los documentos disponibles
const jsonDocumentos = require('../public/json/jsonDocumentos.json');

  //Itero sobre todos los documentos hasta encontrar el que corresponde al actual
  for (let index=0; index < jsonDocumentos.length; index++) {     
    //Si el documento actual es el que busco trabajo con los datos
    if (jsonDocumentos[index].codigoFormulario=="f575rt") {
     fondoF575rt=jsonDocumentos[index].plantillaPdf;
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
  document.getElementById("cuitTrabajador").value=unaPersona.cuit;
  document.getElementById("cuitEmpleador").value=unaPersona.cuitEmpleador;
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
  if (boleta.cuitEmpleado=="") {
    M.toast({html: 'Debe completar el cuit del Empleado'});
   return false;   
  }
  else {
    //Verifico que no falten los guiones ej: xx-xxxxxxxx-x
    if ((boleta.cuitEmpleado[2] !== "-") || (boleta.cuitEmpleado[11] !== "-")) {
     M.toast({html: 'Debe completar el cuit con los guiones. Ejemplo: xx-xxxxxxxx-x'});
     return false;
    }   
  }
  
  //Verifico el cuit Empleador
  if (boleta.cuitEmpleador=="") {
    M.toast({html: 'Debe completar el cuit del Empleador'});
   return false;   
  }
  else {
    //Verifico que no falten los guiones ej: xx-xxxxxxxx-x
    if ((boleta.cuitEmpleador[2] !== "-") || (boleta.cuitEmpleado[11] !== "-")) {
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
 var cuitEmpleado=document.getElementById("cuitTrabajador").value;
 var cuitEmpleador=document.getElementById("cuitEmpleador").value;
 var mesPeriodo=document.getElementById("mesPeriodo").value;
 var anioPeriodo=document.getElementById("anioPeriodo").value;
 var diferenciaContribuciones=document.getElementById("diferenciasContribuciones").value;
 var condicionInteresesResarcitorios=document.getElementById("InteresesResarcitorios").disabled.value; 
 var interesesResarcitorios=document.getElementById("InteresesResarcitorios").value;

 //Genero un Objeto con los datos de este formulario
 var boleta = new Object();
 boleta.apellido=apellidoForm;
 boleta.nombre=nombreFrom;
 boleta.cuitEmpleado=cuitEmpleado;
 boleta.cuitEmpleador=cuitEmpleador;
 boleta.mes=mesPeriodo;
 boleta.anio=anioPeriodo; 
 boleta.diferenciaContribuciones=diferenciaContribuciones; 
 boleta.condicionInteresesResarcitorios=condicionInteresesResarcitorios; 
 boleta.interesesResarcitorios=interesesResarcitorios;

 //Verifico los datos a seleccionar de los pagos
  if (boleta.diferenciaContribuciones=="") {
   boleta.marcaDiferenciaContribuciones=" ";
  }
  else {
   boleta.marcaDiferenciaContribuciones="X";
  }
    
  if (boleta.interesesResarcitorios=="") {
   boleta.marcaInteresesResarcitorios=" ";
  }
  else {
   boleta.marcaInteresesResarcitorios="X";
  }
 
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
   var linkArchivo=process.env['directorioDocumentos']+apellidoForm+","+nombreFrom+"/F575RT-"+anioPeriodo+"_"+mesPeriodo+".pdf";
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
 <!--
 p {margin: 0; padding: 0;}	.ft00{font-size:15px;font-family:ORIDKM+Arial;color:#2b2728;}
 .ft01{font-size:12px;font-family:ZSQRIQ+ArialMT;color:#2b2728;}
 .ft02{font-size:9px;font-family:ZSQRIQ+ArialMT;color:#231f20;}
 .ft03{font-size:15px;font-family:ZSQRIQ+ArialMT;color:#2b2728;}
 .ft04{font-size:11px;font-family:ZSQRIQ+ArialMT;color:#2b2728;}
 .ft05{font-size:9px;font-family:ZSQRIQ+ArialMT;color:#2b2728;}
 .ft06{font-size:10px;font-family:ZSQRIQ+ArialMT;color:#2b2728;}
 .ft07{font-size:21px;font-family:ORIDKM+Arial;color:#2b2728;}
 .ft08{font-size:15px;font-family:ORIDKM+Arial;color:#231f20;}
 .ft09{font-size:10px;font-family:ZSQRIQ+TimesNewRomanPSMT;color:#1d191a;}
.ft010{font-size:21px;font-family:Helvetica;color:#000000;}
 -->
 </style>
 </head>
 <body vlink='blue' link='blue'>
 <div id='page1-div' style='position:relative;width:918px;height:1100px;'>
 <img width='918' height='1188' src='${fondoF575rt}' alt='background image'/>
 <p style='position:absolute;top:165px;left:165px;white-space:nowrap' class='ft00'><b>VOLANTE DE PAGO</b></p>
 <p style='position:absolute;top:224px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:118px;left:506px;white-space:nowrap' class='ft01'>CUIL&#160;EMPLEADO</p>
 <p style='position:absolute;top:118px;left:776px;white-space:nowrap' class='ft01'>PERÍODO</p>
 <p style='position:absolute;top:137px;left:813px;white-space:nowrap' class='ft02'>AÑO</p>
 <p style='position:absolute;top:137px;left:755px;white-space:nowrap' class='ft02'>MES</p>
 <p style='position:absolute;top:223px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:195px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:195px;left:260px;white-space:nowrap' class='ft00'><b>945</b></p>


 <!-- Datos del CUIT EMPLEADO -->
 <p style='position:absolute;top:142px;left:424px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[0]}</b></p>
 <p style='position:absolute;top:142px;left:445px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[1]}</b></p>
 <p style='position:absolute;top:142px;left:490px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[3]}</b></p>
 <p style='position:absolute;top:142px;left:512px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[4]}</b></p>
 <p style='position:absolute;top:142px;left:535px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[5]}</b></p>
 <p style='position:absolute;top:142px;left:558px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[6]}</b></p>
 <p style='position:absolute;top:142px;left:580px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[7]}</b></p>
 <p style='position:absolute;top:142px;left:600px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[8]}</b></p>
 <p style='position:absolute;top:142px;left:625px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[9]}</b></p>
 <p style='position:absolute;top:142px;left:645px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[10]}</b></p>
 <p style='position:absolute;top:142px;left:690px;white-space:nowrap' class='ft00'><b>${boleta.cuitEmpleado[12]}</b></p>
 <!-- Datos del CUIT EMPLEADO -->

 <!-- Datos Periodo -->
 <!-- Mes -->
 <p style='position:absolute;top:147px;left:750px;white-space:nowrap' class='ft00'><b>${boleta.mes[0]}</b></p>
 <p style='position:absolute;top:147px;left:770px;white-space:nowrap' class='ft00'><b>${boleta.mes[1]}</b></p>
 <!-- Año -->
 <p style='position:absolute;top:147px;left:790px;white-space:nowrap' class='ft00'><b>${boleta.anio[0]}</b></p>
 <p style='position:absolute;top:147px;left:810px;white-space:nowrap' class='ft00'><b>${boleta.anio[1]}</b></p>
 <p style='position:absolute;top:147px;left:830px;white-space:nowrap' class='ft00'><b>${boleta.anio[2]}</b></p>
 <p style='position:absolute;top:147px;left:848px;white-space:nowrap' class='ft00'><b>${boleta.anio[3]}</b></p>
 <!-- Datos Periodo --> 

 <p style='position:absolute;top:259px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;APORTE&#160;VOLUNTARIO&#160;(MÍNIMO&#160;$33)</p>
 <p style='position:absolute;top:295px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES POR APORTE VOLUNTARIO</p>
 <p style='position:absolute;top:196px;left:385px;white-space:nowrap' class='ft00'><b>I -&#160;APORTES&#160;DE&#160;SEGURIDAD&#160;SOCIAL</b></p>
 <p style='position:absolute;top:224px;left:387px;white-space:nowrap' class='ft01'>DESCRIPCIÓN</p>
 <p style='position:absolute;top:220px;left:464px;white-space:nowrap' class='ft05'>(1)</p>
 <p style='position:absolute;top:224px;left:813px;white-space:nowrap' class='ft01'>IMPORTE</p>
 <p style='position:absolute;top:256px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;2</b></p>
 <p style='position:absolute;top:258px;left:280px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;2</b></p>
 <p style='position:absolute;top:294px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;2</b></p>
 <p style='position:absolute;top:294px;left:281px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:1156px;left:114px;white-space:nowrap' class='ft06'>(1)&#160;Marcar&#160;con X el&#160;cuadro&#160;que&#160;corresponde.</p>
 <p style='position:absolute;top:1019px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:1018px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:992px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:992px;left:260px;white-space:nowrap' class='ft00'><b>786</b></p>
 <p style='position:absolute;top:1055px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;DIFERENCIA&#160;DE ASEGURADORA RIESGOS DE TRABAJO</p>
 <p style='position:absolute;top:1091px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES RESARCITORIOS&#160;</p>
 <p style='position:absolute;top:1127px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES CAPITALIZABLES</p>
 <p style='position:absolute;top:939px;left:266px;white-space:nowrap' class='ft00'><b>IV -&#160;COBERTURA ASEGURADORA RIESGOS DE TRABAJO (ART)</b></p>

 <!-- CUIT EMPLEADOR -->
 <p style='position:absolute;top:970px;left:578px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[0]}</p>
 <p style='position:absolute;top:970px;left:600px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[1]}</p>
 <p style='position:absolute;top:970px;left:645px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[3]}</p>
 <p style='position:absolute;top:970px;left:668px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[4]}</p>
 <p style='position:absolute;top:970px;left:690px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[5]}</p>
 <p style='position:absolute;top:970px;left:712px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[6]}</p>
 <p style='position:absolute;top:970px;left:735px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[7]}</p>
 <p style='position:absolute;top:970px;left:755px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[8]}</p>
 <p style='position:absolute;top:970px;left:778px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[9]}</p>
 <p style='position:absolute;top:970px;left:800px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[10]}</p>
 <p style='position:absolute;top:970px;left:845px;white-space:nowrap' class='ft00'>${boleta.cuitEmpleador[12]}</p>
 <!-- CUIT EMPLEADOR -->

 <p style='position:absolute;top:1019px;left:387px;white-space:nowrap' class='ft01'>DESCRIPCIÓN</p>
 <p style='position:absolute;top:1015px;left:464px;white-space:nowrap' class='ft05'>(1)</p>
 <p style='position:absolute;top:1019px;left:813px;white-space:nowrap' class='ft01'>IMPORTE</p>
 <p style='position:absolute;top:1053px;left:280px;white-space:nowrap' class='ft00'><b>9&#160;3&#160;2</b></p>
 <p style='position:absolute;top:1089px;left:281px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:1053px;left:154px;white-space:nowrap' class='ft00'><b>9&#160;3&#160;2</b></p>
 <p style='position:absolute;top:1090px;left:155px;white-space:nowrap' class='ft00'><b>9&#160;3&#160;2</b></p>
 <p style='position:absolute;top:1125px;left:280px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;2</b></p>
 <p style='position:absolute;top:1126px;left:154px;white-space:nowrap' class='ft00'><b>9&#160;3&#160;2</b></p>
 <p style='position:absolute;top:364px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:363px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:335px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:335px;left:260px;white-space:nowrap' class='ft00'><b>946</b></p>
 <p style='position:absolute;top:399px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;DIFERENCIA&#160;DE&#160;CONTRIBUCIONES</p>
 <p style='position:absolute;top:428px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES RESARCITORIOS POR&#160;DIFERENCIA&#160;DE&#160;</p>
 <p style='position:absolute;top:441px;left:479px;white-space:nowrap' class='ft04'>&#160; &#160;CONTRIBUCIONES</p>
 <p style='position:absolute;top:471px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES CAPITALIZABLES</p>
 <p style='position:absolute;top:336px;left:385px;white-space:nowrap' class='ft00'><b>II -&#160;CONTRIBUCIONES&#160;DE&#160;SEGURIDAD&#160;SOCIAL</b></p>
 <p style='position:absolute;top:364px;left:387px;white-space:nowrap' class='ft01'>DESCRIPCIÓN</p>
 <p style='position:absolute;top:360px;left:464px;white-space:nowrap' class='ft05'>(1)</p>
 <p style='position:absolute;top:364px;left:813px;white-space:nowrap' class='ft01'>IMPORTE</p>
 <p style='position:absolute;top:398px;left:280px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;6</b></p>
 <p style='position:absolute;top:434px;left:281px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:397px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;6</b></p>
 <p style='position:absolute;top:435px;left:155px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;6</b></p>
 <p style='position:absolute;top:469px;left:280px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;2</b></p>
 <p style='position:absolute;top:470px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;6</b></p>
 <p style='position:absolute;top:538px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:537px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:509px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:509px;left:260px;white-space:nowrap' class='ft00'><b>947</b></p>
 <p style='position:absolute;top:573px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;DIFERENCIA&#160;DE APORTES&#160;Y ADHERENTES</p>
 <p style='position:absolute;top:609px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES RESARCITORIOS POR&#160;DIFERENCIA&#160;DE&#160;APORTES</p>
 <p style='position:absolute;top:645px;left:479px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES CAPITALIZABLES</p>
 <p style='position:absolute;top:510px;left:385px;white-space:nowrap' class='ft00'><b>III - OBRA&#160;SOCIAL</b></p>
 <p style='position:absolute;top:538px;left:387px;white-space:nowrap' class='ft01'>DESCRIPCIÓN</p>
 <p style='position:absolute;top:534px;left:464px;white-space:nowrap' class='ft05'>(1)</p>
 <p style='position:absolute;top:538px;left:813px;white-space:nowrap' class='ft01'>IMPORTE</p>
 <p style='position:absolute;top:572px;left:280px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;5</b></p>
 <p style='position:absolute;top:608px;left:281px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:571px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;5</b></p>
 <p style='position:absolute;top:609px;left:155px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;5</b></p>
 <p style='position:absolute;top:643px;left:280px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;2</b></p>
 <p style='position:absolute;top:644px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;5</b></p>
 <p style='position:absolute;top:698px;left:279px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;3</b></p>
 <p style='position:absolute;top:734px;left:280px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:697px;left:153px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;3</b></p>
 <p style='position:absolute;top:735px;left:154px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;3</b></p>
 <p style='position:absolute;top:769px;left:279px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;2</b></p>
 <p style='position:absolute;top:770px;left:153px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;3</b></p>
 <p style='position:absolute;top:826px;left:279px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;4</b></p>
 <p style='position:absolute;top:862px;left:279px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;1</b></p>
 <p style='position:absolute;top:825px;left:153px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;4</b></p>
 <p style='position:absolute;top:863px;left:153px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;4</b></p>
 <p style='position:absolute;top:897px;left:279px;white-space:nowrap' class='ft00'><b>0&#160;5&#160;2</b></p>
 <p style='position:absolute;top:898px;left:153px;white-space:nowrap' class='ft00'><b>8&#160;9&#160;4</b></p>
 <p style='position:absolute;top:699px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;COBERTURA&#160;GRUPO&#160;FAMILIAR&#160;PRIMARIO (Hasta&#160;Enero&#160;2006)</p>
 <p style='position:absolute;top:735px;left:477px;white-space:nowrap' class='ft04'>-&#160; INTERESES&#160;RESARCITORIOS</p>
 <p style='position:absolute;top:771px;left:477px;white-space:nowrap' class='ft04'>-&#160; INTERESES&#160;CAPITALIZABLES</p>
 <p style='position:absolute;top:827px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;ADHERENTES&#160;Desde&#160;06/2016&#160;$419&#160;c/u.&#160;</p>
 <p style='position:absolute;top:863px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES RESARCITORIOS</p>
 <p style='position:absolute;top:899px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES CAPITALIZABLES</p>
 <p style='position:absolute;top:840px;left:482px;white-space:nowrap' class='ft05'>(De&#160;01/2006&#160;a&#160;03/2008&#160;$22,22;&#160;de&#160;04/2008&#160;a&#160;11/2008&#160;$31;&#160;de&#160;12/2008 a&#160;12/2010&#160;$39;</p>
 <p style='position:absolute;top:851px;left:482px;white-space:nowrap' class='ft05'>de 01/11 a 04/13 $60; de 05/13 a 08/14 $100; de 09/14 a 05/16 $233).</p>
 <p style='position:absolute;top:137px;left:195px;white-space:nowrap' class='ft07'><b>F.575/RT&#160;</b></p>
 <p style='position:absolute;top:38px;left:535px;white-space:nowrap' class='ft08'><b>CASAS PARTICULARES</b></p>
 <p style='position:absolute;top:56px;left:583px;white-space:nowrap' class='ft08'><b>Ley 26.844</b></p>
 <p style='position:absolute;top:74px;left:534px;white-space:nowrap' class='ft08'><b>FORMULARIO DE PAGO</b></p>
 <p style='position:absolute;top:144px;left:472px;white-space:nowrap' class='ft09'>-</p>
 <p style='position:absolute;top:144px;left:673px;white-space:nowrap' class='ft09'>-</p>
 <p style='position:absolute;top:969px;left:627px;white-space:nowrap' class='ft09'>-</p>
 <p style='position:absolute;top:969px;left:827px;white-space:nowrap' class='ft09'>-</p>
 <p style='position:absolute;top:969px;left:428px;white-space:nowrap' class='ft01'>CUIT/CUIL&#160;EMPLEADOR</p>

 
 <!-- Diferencia de Contribuciones -->  
 <p style='position:absolute;top:397px;left:420px;white-space:nowrap' class='ft010'>${boleta.marcaDiferenciaContribuciones}</p> 
 <p style='position:absolute;top:397px;left:813px;white-space:nowrap' class='ft010'>${boleta.diferenciaContribuciones}</p> 
 
 <!-- Diferencia de Contribuciones -->
 <!-- Intereses Resarcitorios -->
 <p style='position:absolute;top:430px;left:420px;white-space:nowrap' class='ft010'>${boleta.marcaInteresesResarcitorios}</p>
 <p style='position:absolute;top:435px;left:813px;white-space:nowrap' class='ft010'>${boleta.interesesResarcitorios}</p>
 <!-- Intereses Resarcitorios -->
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