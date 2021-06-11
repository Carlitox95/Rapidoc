//Inicializo el Nav
document.addEventListener('DOMContentLoaded', function() {
 var elems = document.querySelectorAll('.sidenav');
 var instances = M.Sidenav.init(elems, {});
});

//Funcion que me genera los enlaces del menu principal
function crearMenuPrincipal() {
 //Obtengo los contenedores de los navs donde iran los links
 var contenedorMenu=document.getElementById("nav"); 

 //Creo el enlace correcto para el logo
 document.getElementById("logoUrl").href="home.html";

 //Creo el enlace para acceder a la Home
 var liHome=document.createElement("li");
 aliHome=document.createElement("a");
 aliHome.innerHTML="<i class='material-icons left'>home</i> Home";
 aliHome.setAttribute("href","home.html");
 liHome.appendChild(aliHome);
 //Termino el enlace

 //Creo el enlace para acceder a los formularios
 var liFormularios=document.createElement("li");
 var aliFormularios=document.createElement("a"); 
 aliFormularios.innerHTML="<i class='material-icons left'>edit</i> Formularios";
 aliFormularios.setAttribute("href","gestorDocumentos.html");
 liFormularios.appendChild(aliFormularios);
 //Termino el enlace

 //Creo el enlace para acceder el gestor de archivos
 var liGestorArchivos=document.createElement("li");
 var aliGestorArchivos=document.createElement("a"); 
 aliGestorArchivos.innerHTML="<i class='material-icons left'>folder</i> Gestor de Archivos";
 aliGestorArchivos.setAttribute("href","gestorArchivos.html");
 liGestorArchivos.appendChild(aliGestorArchivos);
 //Termino el enlace

 //Creo el boton para acceder a los registros de datos personales
 var liDatosApp=document.createElement("li");
 var aliDatosApp=document.createElement("a"); 
 aliDatosApp.innerHTML="<i class='material-icons left'>person</i> Registros Personales";
 aliDatosApp.setAttribute("href","gestorPersonas.html");
 liDatosApp.appendChild(aliDatosApp);
 //Termino el enlace    

 //Creo el boton para acceder a las configuraciones del sistema
 var liConfigApp=document.createElement("li");
 var aliConfigApp=document.createElement("a"); 
 aliConfigApp.innerHTML="<i class='material-icons left'>brightness_high</i> Configuracion";
 aliConfigApp.setAttribute("href","#");
 liConfigApp.appendChild(aliConfigApp);
 //Termino el enlace

 //Creo el enlace para acceder al boton de salir
 var liSalir=document.createElement("li");
 var aliSalir=document.createElement("a"); 
 aliSalir.innerHTML="<i class='material-icons left'>exit_to_app</i> Salir";
 aliSalir.setAttribute("href","../index.html");
 liSalir.appendChild(aliSalir);
 //Termino el enlace

 //Inserto los elementos
 contenedorMenu.appendChild(liHome);
 contenedorMenu.appendChild(liFormularios);
 contenedorMenu.appendChild(liGestorArchivos);
 contenedorMenu.appendChild(liDatosApp);
 contenedorMenu.appendChild(liConfigApp);
 contenedorMenu.appendChild(liSalir); 
}

//Funcion que me genera los enlaces del menu principal Mobile
function crearMenuPrincipalMobile() {  
 var contenedorMenuMobile=document.getElementById("mobile-demo"); 
 
 //Creo el enlace correcto para el logo
 document.getElementById("logoUrl").href="home.html";

 //Creo el enlace para acceder a la Home
 var liHome=document.createElement("li");
 aliHome=document.createElement("a");
 aliHome.innerHTML="<i class='material-icons left'>home</i> Home";
 aliHome.setAttribute("href","home.html");
 liHome.appendChild(aliHome);
 //Termino el enlace
   
 //Creo el enlace para acceder a los formularios
 var liFormularios=document.createElement("li");
 var aliFormularios=document.createElement("a"); 
 aliFormularios.innerHTML="<i class='material-icons left'>edit</i> Formularios";
 aliFormularios.setAttribute("href","gestorDocumentos.html");
 liFormularios.appendChild(aliFormularios);
 //Termino el enlace
   
 //Creo el enlace para acceder el gestor de archivos
 var liGestorArchivos=document.createElement("li");
 var aliGestorArchivos=document.createElement("a"); 
 aliGestorArchivos.innerHTML="<i class='material-icons left'>folder</i> Gestor de Archivos";
 aliGestorArchivos.setAttribute("href","gestorDocumentos.html");
 liGestorArchivos.appendChild(aliGestorArchivos);
 //Termino el enlace
   
 //Creo el boton para acceder a los registros de datos personales
 var liDatosApp=document.createElement("li");
 var aliDatosApp=document.createElement("a"); 
 aliDatosApp.innerHTML="<i class='material-icons left'>person</i> Registros Personales";
 aliDatosApp.setAttribute("href","registroPersonal.html");
 liDatosApp.appendChild(aliDatosApp);
 //Termino el enlace    
   
 //Creo el boton para acceder a las configuraciones del sistema
 var liConfigApp=document.createElement("li");
 var aliConfigApp=document.createElement("a"); 
 aliConfigApp.innerHTML="<i class='material-icons left'>brightness_high</i> Configuracion";
 aliConfigApp.setAttribute("href","gestorConfiguracion.html");
 liConfigApp.appendChild(aliConfigApp);
 //Termino el enlace
   
 //Creo el enlace para acceder al boton de salir
 var liSalir=document.createElement("li");
 var aliSalir=document.createElement("a"); 
 aliSalir.innerHTML="<i class='material-icons left'>exit_to_app</i> Salir";
 aliSalir.setAttribute("href","../index.html");
 liSalir.appendChild(aliSalir);
 //Termino el enlace
   
 //Inserto los elementos en el nav mobile
 contenedorMenuMobile.appendChild(liHome);
 contenedorMenuMobile.appendChild(liFormularios);
 contenedorMenuMobile.appendChild(liGestorArchivos);
 contenedorMenuMobile.appendChild(liDatosApp);
 contenedorMenuMobile.appendChild(liConfigApp);
 contenedorMenuMobile.appendChild(liSalir);
}

//Invoco a la funcion para crear el menu
crearMenuPrincipal();

//Invoco a la funcion para crear el menu Mobile
crearMenuPrincipalMobile();