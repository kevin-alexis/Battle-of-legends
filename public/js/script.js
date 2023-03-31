//iniciar Juego
const seleccionarAtaque = document.getElementById("seleccionar-ataque");
const botonPersonajeJugador = document.getElementById("boton-personaje");
const botonReiniciar = document.getElementById("reiniciar");

const spanPersonajeJugador = document.getElementById("personaje-jugador");
const spanPersonajeEnemigo = document.getElementById("personaje-enemigo");

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

const sectionMensajes = document.getElementById("resultado");
const ataquesDelJugador = document.getElementById("ataques-del-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques");

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null;
let enemigoId = null;
let personajes = [];
let personajesEnemigos = [];
let ataqueJugador = [];
let ataqueEnemigo = [];
let opcionDePersonajes;
let inputLadron;
let inputCaballero;
let inputMago;
let personajeJugador;
let ataquesJugador;
let ataquesEnemigo;
let botonAgua;
let botonFuego;
let botonTierra;
let botones = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let personajeJugadorObjeto;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let vidasJugador = 3;
let vidasEnemigo = 3;
let lienzo = mapa.getContext("2d"); //nos permite tener el lienzo para dibujar dentro del canvas
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/fondo.jpg"
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 200; //toma el ancho de la pantalla y le restamos 20 para que no la tome toda

alturaQueBuscamos = anchoDelMapa * 600 / 800;
mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

//las clases comienzan con mayuscula y las variables con minuscula
class Personaje{
    constructor(nombre, foto, vida, fotoMapa, id=null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.ancho = 40;
        this.alto = 40;
        this.x = aleatorio(0, mapa.width - this.ancho); //numero aleatorio entre el 0 y el ancho del mapa, pero se le resta el ancho del personaje para que no se salga de mapa
        this.y = aleatorio(0, mapa.height - this.alto);
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa;
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarPersonaje(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let ladron = new Personaje("Ladron", "./assets/Ladron.png", 5, "./assets/Ladron.png"); //crear el personaje ladron
let caballero = new Personaje("Caballero", "./assets/Caballero.png", 5, "./assets/Caballero.png");//crear el personaje caballero
let mago = new Personaje("Mago", "./assets/Mago.png", 5, "./assets/Mago.png");//crear el personaje mago

const LADRON_ATAQUES = [
    { nombre: "💧", id: "boton-Agua" },
    { nombre: "💧", id: "boton-Agua" },
    { nombre: "💧", id: "boton-Agua" },
    { nombre: "🔥", id: "boton-Fuego" },
    { nombre: "🌱", id: "boton-Tierra" }
];

const CABALLERO_ATAQUES = [
    { nombre: "🌱", id: "boton-Tierra" },
    { nombre: "🌱", id: "boton-Tierra" },
    { nombre: "🌱", id: "boton-Tierra" },
    { nombre: "💧", id: "boton-Agua" },
    { nombre: "🔥", id: "boton-Fuego" }
];

const MAGO_ATAQUES = [
    { nombre: "🔥", id: "boton-Fuego" },
    { nombre: "🔥", id: "boton-Fuego" },
    { nombre: "🔥", id: "boton-Fuego" },
    { nombre: "💧", id: "boton-Agua" },
    { nombre: "🌱", id: "boton-Tierra" }   
];

ladron.ataques.push(...LADRON_ATAQUES) //agregar ataques a ladron, los 3 puntos hace que en lugar de pasar los datos como lista, los pasa como si nosotros los hubieramos escrito

caballero.ataques.push(...CABALLERO_ATAQUES) //agregar ataques a caballero

mago.ataques.push(...MAGO_ATAQUES) //agregar ataques a mago

personajes.push(ladron, caballero, mago); //agregar personajes al arreglo

function iniciarJuego(){
    seleccionarAtaque.style.display = "none"; //esconde la seccion
    sectionVerMapa.style.display = "none";

    //por cada uno de los elementos, haz algo..., por cada personaje que existe en mi arreglo de personajes, haz lo siguiente...
    personajes.forEach((personaje) => {
        //templates literarios, se debe utilizar la comilla invertida
        opcionDePersonajes = `
        <input type="radio" name="personaje" id=${personaje.nombre} />
        <label class="tarjeta-de-personaje" for="${personaje.nombre}">
            <p>${personaje.nombre}</p>
            <img src="${personaje.foto}" alt="${personaje.nombre}">
        </label> <!-- El for vincula un label con un input, a traves del id--> 
        `; //se debe dejar un espacio entre el corchete '}' y  la barra de cierre '/'

        contenedorTarjetas.innerHTML += opcionDePersonajes; //agregar las tarjetas, se le debe agregar el + para que se agreguen todas las tarjetas y no solo se vea la ultima

        inputLadron = document.getElementById("Ladron");
        inputCaballero = document.getElementById("Caballero");
        inputMago = document.getElementById("Mago");

    })

    botonPersonajeJugador.addEventListener("click", seleccionarPersonajeJugador);
    botonReiniciar.style.display = "none";
    botonReiniciar.addEventListener("click", reiniciarJuego);

    unirseAlJuego();
}


function unirseAlJuego(){ //de tipo get
    fetch("http://192.168.0.179:8080/unirse") //realiza una llamada tip get
        .then(function (res) { //.then es para peticiones asincronas, al recibir la respuesta, ejecuta el callback
            if(res.ok){
                res.text()
                    .then(function(respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarPersonajeJugador(){

    if(inputLadron.checked){
        spanPersonajeJugador.innerText = inputLadron.id;    
        personajeJugador = inputLadron.id;
    }
    else if(inputCaballero.checked){
        spanPersonajeJugador.innerText = inputCaballero.id;
        personajeJugador = inputCaballero.id;
    }
    else if(inputMago.checked){
        spanPersonajeJugador.innerText = inputMago.id;
        personajeJugador = inputMago.id;
    }
    else{
        alert("Selecciona un personaje para continuar");
        return
    }

        extraerAtaques(personajeJugador);     
        sectionVerMapa.style.display = "flex"; 
        iniciarMapa();
        //lienzo.fillRect(5,15,20,40) crea un rectangulo dentro del canvas 5 para X, 15 para Y, un alto de 20 y un ancho de 40
        let seleccionarPersonaje = document.getElementById("seleccionar-personaje");
        seleccionarPersonaje.style.display = "none";
        elegirPersonaje(personajeJugador);

}

function elegirPersonaje(personajeJugador){ // de tipo post
    fetch(`http://192.168.0.179:8080/personaje/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            personaje: personajeJugador
        })
    })
        
}

function extraerAtaques(personajeJugador){
    let ataques;
    for (let i = 0; i < personajes.length; i++) {
        if(personajeJugador == personajes[i].nombre){
            ataques = personajes[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        ataquesJugador = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesJugador;
        //console.log(ataque)
    });

    botonAgua = document.getElementById("boton-Agua");
    botonFuego = document.getElementById("boton-Fuego");
    botonTierra = document.getElementById("boton-Tierra");
    botones = document.querySelectorAll(".BAtaque");

}

function secuenciaAtaque(){
    botones.forEach((boton)=>{
        boton.addEventListener("click", (e) =>{
            if(e.target.textContent === "🔥"){
                ataqueJugador.push("Fuego");
                console.log(ataqueJugador);
                boton.style.background = "#112f58";
                boton.disabled = true; //no colocas disabled en HTML, al activarlo se coloca en HTML
            }
            else if(e.target.textContent === "💧"){
                ataqueJugador.push("Agua");
                console.log(ataqueJugador);
                boton.style.background = "#112f58";
                boton.disabled = true;
            }
            else{
                ataqueJugador.push("Tierra");
                console.log(ataqueJugador);
                boton.style.background = "#112f58";
                boton.disabled = true;
            }
            if(ataqueJugador.length === 5){
                enviarAtaques()
            }
            
        })   
    })
    
}

//ataques del jugador (mis ataques)
function enviarAtaques(){
    fetch(`http://192.168.0.179:8080/personaje/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

//ataques del enemigo
function obtenerAtaques(){
    fetch(`http://192.168.0.179:8080/personaje/${enemigoId}/ataques`)
        .then(function (res){
            if(res.ok){
                res.json()
                    .then(function ({ ataques }){
                        if (ataques.length === 5){
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        }
)}

function seleccionarPersonajeEnemigo(enemigo){
    spanPersonajeEnemigo.innerText = enemigo.nombre; 
    ataquesEnemigo = enemigo.ataques;
    secuenciaAtaque();
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/* function seleccionarataqueEnemigo(){
    let ataqueEnemigoAleatorio = aleatorio(0, ataquesEnemigo.length - 1);
    //const spanPersonajeEnemigo = document.getElementById("personaje-enemigo");

    if(ataqueEnemigoAleatorio == 0 ||ataqueEnemigoAleatorio == 1){
        ataqueEnemigo.push("Fuego");
    }
    else if(ataqueEnemigoAleatorio == 3 || ataqueEnemigoAleatorio == 4){
        ataqueEnemigo.push("Agua");
    }
    else{
        ataqueEnemigo.push("Tierra"); 
    }
    console.log(ataqueEnemigo)
    iniciarPelea();
} */

/* function iniciarPelea(){
    if (ataqueJugador.length === 5){
        combate();
    }
    
} */

function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataqueJugador[jugador];
    indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

function combate(){
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]){
            indexAmbosOponentes(index, index)
            crearMensaje("hubo un empate 😐")
        }
        else if((ataqueJugador[index] === "Agua" && ataqueEnemigo[index] ==="Fuego") || (ataqueJugador[index] === "Fuego" && ataqueEnemigo[index] == "Tierra") || (ataqueJugador[index] === "Tierra" && ataqueEnemigo[index] === "Agua")){
            indexAmbosOponentes(index, index)
            crearMensaje("Ganaste 😎")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }
        else{
            indexAmbosOponentes(index, index)
            crearMensaje("Perdiste 😔")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }

        ataqueJugador[index]
    }

    revisarVictorias()
}

function revisarVictorias(){
    if(victoriasJugador === victoriasEnemigo){
        crearMensajeFinal("Oh no, es un empate!!");
    }
    else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("Felicitaciones, ganaste");
        
    }
    else{
        crearMensajeFinal("Perdiste, sigue intentando");

    }
}

function crearMensaje(resultado){
    let nuevoAtaqueDelJugador = document.createElement("p");
    let nuevoAtaqueDelEnemigo = document.createElement("p");

    sectionMensajes.innerText = resultado;
    nuevoAtaqueDelJugador.innerText = indexAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerText = indexAtaqueEnemigo;

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function crearMensajeFinal(resultadoFinal){ 
    sectionMensajes.innerHTML = ("<strong>"+resultadoFinal+"</strong>");
    botonReiniciar.style.display = "block";
}

function reiniciarJuego(){
    location.reload(); //recargar la pagina, nos dice que recargue la ubicación
}

function pintarCanvas(){

    personajeJugadorObjeto.x = personajeJugadorObjeto.x + personajeJugadorObjeto.velocidadX;
    personajeJugadorObjeto.y = personajeJugadorObjeto.y + personajeJugadorObjeto.velocidadY;
    lienzo.clearRect(0, 0, mapa.width, mapa.height) // para limpiar el canvas
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    
    personajeJugadorObjeto.pintarPersonaje();
    enviarPosicion(personajeJugadorObjeto.x, personajeJugadorObjeto.y);
    personajesEnemigos.forEach(function (personajeEnemigo) {
        personajeEnemigo.pintarPersonaje()
        revisarColision(personajeEnemigo)
    })

}

function enviarPosicion(x, y){
    fetch(`http://192.168.0.179:8080/personaje/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,  //usamos lo mismo para clave que para variable, es una manera de abreviar x: x, de igual forma y: y
            y
        })
    })

     .then(function (res){
        if(res.ok) {
            res.json()
                .then(function ({ enemigos }){
                    console.log(enemigos)
                    personajesEnemigos = enemigos.map(function(enemigo){ //map es como forEach, pero en lugar de solo iterar, ahora igual va a retornar un valor
                        const personajeNombre = enemigo.personaje.nombre || ""
                        let personajeEnemigo = null
                        if(personajeNombre ==="Ladron"){
                            personajeEnemigo = new Personaje("Ladron", "./assets/Ladron.png", 5, "./assets/Ladron.png", enemigo.id); //crear el personaje ladron
                        }
                        else if(personajeNombre ==="Caballero"){
                            personajeEnemigo = new Personaje("Caballero", "./assets/Caballero.png", 5, "./assets/Caballero.png", enemigo.id);//crear el personaje caballero
                        }
                        else{
                            personajeEnemigo = new Personaje("Mago", "./assets/Mago.png", 5, "./assets/Mago.png", enemigo.id);//crear el personaje mago
                        }

                        personajeEnemigo.x = enemigo.x
                        personajeEnemigo.y = enemigo.y

                        return personajeEnemigo
                    })
        })
      }
    })
}

function moverDerecha(){
    
    personajeJugadorObjeto.velocidadX = 5;
}

function moverIzquierda(){
    personajeJugadorObjeto.velocidadX = -5;
}

function moverAbajo(){
    personajeJugadorObjeto.velocidadY = 5;
}

function moverArriba(){
    personajeJugadorObjeto.velocidadY = -5;
}

function detenerMovimiento(){
    personajeJugadorObjeto.velocidadX = 0;
    personajeJugadorObjeto.velocidadY = 0;
}

function sePresionoUnaTecla(event){
    switch(event.key){
        case "ArrowUp":{
            moverArriba();
            break;
        }
        case "ArrowDown":{
            moverAbajo();
            break;
        }
        case "ArrowLeft":{
            moverIzquierda();
            break;
        }
        case "ArrowRight":{
            moverDerecha();
            break;
        } 
        default:
            break;
    }
}

function iniciarMapa(){
    personajeJugadorObjeto = obtenerObjetoPersonaje();
    intervalo = setInterval(pintarCanvas, 50) //funcion que ejecutara y cada cuanto la ejecutara en milisegundos
    window.addEventListener("keydown", sePresionoUnaTecla)

    window.addEventListener("keyup", detenerMovimiento)
}

function obtenerObjetoPersonaje(){
    for (let i = 0; i < personajes.length; i++) {
        if(personajeJugador == personajes[i].nombre){
            return personajes[i];
        }
    }
}

function revisarColision(enemigo){
    //porque arriba a la izquierda es donde empieza el plano 0,0
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaPersonaje = personajeJugadorObjeto.y;
    const abajoPersonaje = personajeJugadorObjeto.y + personajeJugadorObjeto.alto;
    const derechaPersonaje = personajeJugadorObjeto.x + personajeJugadorObjeto.ancho;
    const izquierdaPersonaje = personajeJugadorObjeto.x;

    if(
        abajoPersonaje < arribaEnemigo ||
        arribaPersonaje > abajoEnemigo ||
        derechaPersonaje < izquierdaEnemigo ||
        izquierdaPersonaje > derechaEnemigo
    ){
        return;
    }
    detenerMovimiento();
    console.log("se detecto la colision")

    enemigoId = enemigo.id
    clearInterval(intervalo); //para que se detenga ese ciclo de estar ejecutando la función, porque si se detiene el movimiento, se debe detener el intervalo
    seleccionarAtaque.style.display = "flex"; //vuelve a mostrar la seccion
    sectionVerMapa.style.display = "none";
    seleccionarPersonajeEnemigo(enemigo);
    //alert("Hay colision con " + enemigo.nombre);

}

//ya que se carga la pagina, carga el script dentro de iniciar juego
window.addEventListener("load", iniciarJuego);
