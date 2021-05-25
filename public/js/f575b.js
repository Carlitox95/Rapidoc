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
let fondoF575B="";

//Levanto mi JSON con los documentos disponibles
const jsonDocumentos = require('../public/json/jsonDocumentos.json');

  //Itero sobre todos los documentos hasta encontrar el que corresponde al actual
  for (let index=0; index < jsonDocumentos.length; index++) {     
    //Si el documento actual es el que busco trabajo con los datos
    if (jsonDocumentos[index].codigoFormulario=="f575b") {
     fondoF575B=jsonDocumentos[index].plantillaPdf;
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




//Funcion que verifica los parametros del formulario
function validarParametros(boleta,modoEjecucion) {
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
 var condicionPdf=validarParametros(boleta,modoEjecucion);  

    //Verifico que todas las condiciones esten dadas para seguir
    if (condicionPdf==false) {
      M.toast({html: 'No se puede crear el formulario debido a que hay campos incompletos y/o erroneos'});
    }
    else {       
        //Si el modo de ejecucion es unico , genero solo un PDF
        if (modoEjecucion =="unico") {
         activarPantallaCarga();
         //Llamo a la funcion que me genera el codigo HTML
         var contenidoHTML=generarContenido(boleta);
         //Defino el nombre para guardar el formulario de Pago
         var linkArchivo=process.env['directorioDocumentos']+apellidoForm+","+nombreFrom+"/F575B-"+anioPeriodo+"_"+mesPeriodo+".pdf";
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
}

//Funcion que me sirve para generar el contenido de los PDF
function generarContenido(boleta) { 
 var plantilla =`
 <!-- Inicia el HTML del PDF -->
 <!DOCTYPE html>
 <html>
 <head>
 <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
 <style type='text/css'>
     p {margin: 0; padding: 0;}	.ft00{font-size:15px;font-family:JDKOXG+Arial;color:#2b2728;}
	 .ft01{font-size:12px;font-family:TFNWHM+ArialMT;color:#2b2728;}
	 .ft02{font-size:9px;font-family:TFNWHM+ArialMT;color:#231f20;}
	 .ft03{font-size:15px;font-family:TFNWHM+ArialMT;color:#2b2728;}
	 .ft04{font-size:11px;font-family:TFNWHM+ArialMT;color:#2b2728;}
	 .ft05{font-size:9px;font-family:TFNWHM+ArialMT;color:#2b2728;}
	 .ft06{font-size:10px;font-family:TFNWHM+ArialMT;color:#2b2728;}
	 .ft07{font-size:21px;font-family:JDKOXG+Arial;color:#2b2728;}
  </style>
 </head>
 <body style='padding-left:5%;padding-top:5%;padding-bottom:0px;'>
 <div id='page1-div' style='position:relative;width:918px;height:1188px;'> 

 <img width='918' height='1188' src=${fondoF575B} alt='background image'/>
 <p style='position:absolute;top:165px;left:165px;white-space:nowrap' class='ft00'><b>VOLANTE DE PAGO</b></p>
 <p style='position:absolute;top:41px;left:462px;white-space:nowrap' class='ft00'><b>TRABAJADORES DE&#160;CASAS PARTICULARES</b></p>
 <p style='position:absolute;top:73px;left:544px;white-space:nowrap' class='ft00'><b>PAGOS&#160;VOLUNTARIOS</b></p>
 <p style='position:absolute;top:224px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:118px;left:506px;white-space:nowrap' class='ft01'>CUIL&#160;EMPLEADO</p>

 <!-- Imprimo en el PDF el Cuit Empleado -->
 <p style='position:absolute;top:140px;left:390px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[0]}</p>
 <p style='position:absolute;top:140px;left:415px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[1]}</p>
 <p style='position:absolute;top:140px;left:440px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[2]}</p>
 <p style='position:absolute;top:140px;left:465px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[3]}</p>
 <p style='position:absolute;top:140px;left:490px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[4]}</p>
 <p style='position:absolute;top:140px;left:520px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[5]}</p>
 <p style='position:absolute;top:140px;left:545px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[6]}</p>
 <p style='position:absolute;top:140px;left:570px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[7]}</p>
 <p style='position:absolute;top:140px;left:595px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[8]}</p>
 <p style='position:absolute;top:140px;left:625px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[9]}</p>
 <p style='position:absolute;top:140px;left:650px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[10]}</p>
 <p style='position:absolute;top:140px;left:680px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[11]}</p>
 <p style='position:absolute;top:140px;left:700px;white-space:nowrap;font-size:20px'>${boleta.cuitEmpleado[12]}</p>
 <!-- Imprimo en el PDF el Cuit Empleado -->
 <!-- Periodo Empleado -->
 <p style='position:absolute;top:145px;left:750px;white-space:nowrap;font-size:20px'>${boleta.mes[0]}</p>
 <p style='position:absolute;top:145px;left:770px;white-space:nowrap;font-size:20px'>${boleta.mes[1]}</p>
 <p style='position:absolute;top:145px;left:790px;white-space:nowrap;font-size:20px'>${boleta.anio[0]}</p>
 <p style='position:absolute;top:145px;left:810px;white-space:nowrap;font-size:20px'>${boleta.anio[1]}</p>
 <p style='position:absolute;top:145px;left:830px;white-space:nowrap;font-size:20px'>${boleta.anio[2]}</p>
 <p style='position:absolute;top:145px;left:850px;white-space:nowrap;font-size:20px'>${boleta.anio[3]}</p>
 <!-- Periodo Empleado -->
 <p style='position:absolute;top:118px;left:776px;white-space:nowrap' class='ft01'>PERÍODO</p>
 <p style='position:absolute;top:137px;left:813px;white-space:nowrap' class='ft02'>AÑO</p>
 <p style='position:absolute;top:137px;left:755px;white-space:nowrap' class='ft02'>MES</p>
 <p style='position:absolute;top:223px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:195px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:195px;left:260px;white-space:nowrap' class='ft00'><b>301</b></p>
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
 <p style='position:absolute;top:931px;left:114px;white-space:nowrap' class='ft06'>(1)&#160;Marcar&#160;con X el&#160;cuadro&#160;que&#160;corresponde.</p>
 <p style='position:absolute;top:364px;left:138px;white-space:nowrap' class='ft01'>CONCEPTO</p>
 <p style='position:absolute;top:363px;left:253px;white-space:nowrap' class='ft01'>SUBCONCEPTO</p>
 <p style='position:absolute;top:335px;left:184px;white-space:nowrap' class='ft03'>IMPUESTO</p>
 <p style='position:absolute;top:335px;left:260px;white-space:nowrap' class='ft00'><b>351</b></p>
 <!-- Diferencia de CONTRIBUCIONES -->
 <p style='position:absolute;top:395px;left:420px;white-space:nowrap font-size: 250px;'>${boleta.marcaDiferenciaContribuciones}</p>
 <p style='position:absolute;top:395px;left:820px;white-space:nowrap font-size: 250px;'>${boleta.diferenciaContribuciones}</p>
 <!-- Diferencia de CONTRIBUCIONES -->
 <!-- Intereses Resarcitorios por Diferencia de CONTRIBUCIONES -->
 <p style='position:absolute;top:430px;left:420px;white-space:nowrap font-size: 250px;'>${boleta.marcaInteresesResarcitorios}</p>
 <p style='position:absolute;top:430px;left:820px;white-space:nowrap font-size: 250px;'>${boleta.interesesResarcitorios}</p>
 <!-- Intereses Resarcitorios por Diferencia de CONTRIBUCIONES -->
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
 <p style='position:absolute;top:509px;left:260px;white-space:nowrap' class='ft00'><b>302</b></p>
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
 <p style='position:absolute;top:827px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;ADHERENTES&#160;Desde&#160;05/2013&#160;$100&#160;c/u&#160;</p>
 <p style='position:absolute;top:863px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES RESARCITORIOS</p>
 <p style='position:absolute;top:899px;left:477px;white-space:nowrap' class='ft04'>-&#160;&#160;INTERESES CAPITALIZABLES</p>
 <p style='position:absolute;top:840px;left:482px;white-space:nowrap' class='ft05'>(De&#160;01/2006&#160;a&#160;03/2008&#160;$22,22;&#160;de&#160;04/2008&#160;a&#160;11/2008&#160;$31;&#160;de&#160;12/2008 a&#160;12/2010&#160;$39;</p>
 <p style='position:absolute;top:851px;left:482px;white-space:nowrap' class='ft05'>de 01/2011 a 04/2013 $60)</p>
 <p style='position:absolute;top:137px;left:197px;white-space:nowrap' class='ft07'><b>F. 575/B</b></p>
 <!-- Datos CUIT del EMPLEADOR -->
 <!-- Imprimo en el PDF el Cuit Empleado -->
 <p style='position:absolute;top:950px;left:390px;white-space:nowrap;font-size:24px'>CUIT EMPLEADOR</p>
 <p style='position:absolute;top:1000px;left:390px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[0]}</p>
 <p style='position:absolute;top:1000px;left:415px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[1]}</p>
 <p style='position:absolute;top:1000px;left:440px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[2]}</p>
 <p style='position:absolute;top:1000px;left:465px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[3]}</p>
 <p style='position:absolute;top:1000px;left:490px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[4]}</p>
 <p style='position:absolute;top:1000px;left:520px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[5]}</p>
 <p style='position:absolute;top:1000px;left:545px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[6]}</p>
 <p style='position:absolute;top:1000px;left:570px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[7]}</p>
 <p style='position:absolute;top:1000px;left:595px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[8]}</p>
 <p style='position:absolute;top:1000px;left:625px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[9]}</p>
 <p style='position:absolute;top:1000px;left:650px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[10]}</p>
 <p style='position:absolute;top:1000px;left:680px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[11]}</p>
 <p style='position:absolute;top:1000px;left:700px;white-space:nowrap;font-size:24px'>${boleta.cuitEmpleador[12]}</p>
 <!-- Imprimo en el PDF el Cuit Empleado -->

 <!-- Datos CUIT del EMPLEADOR -->
 </div>
 </body>
 </html>
 <!-- Termina el HTML del PDF -->
 `;
 
 return plantilla;

}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////// Codigo de Ejecucion ////////////////////////////
/////////////////////////////////////////////////////////////////////////////

//Invoco a la funcion para listar las personas
listarPersonas();