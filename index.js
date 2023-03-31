//Este es el servidor

const express = require("express"); //invoco la libreria express en la variable express
const cors = require("cors");

const app = express();

app.use(express.static("public")) //funcion que nos sirve para brindar archivos estaticos
app.use(cors()); //para que la app use la libreria cors / deshabilitamos los posibes errores relacionados con cors
app.use(express.json()); //habilitamos la posibilidad de recibir peticiones de tipo post que tengan el tipo json

const jugadores = [];

class Jugador{
    constructor(id){
        this.id = id
    }

    asignarPersonaje(personaje){
        this.personaje = personaje
    }

    actualizarPosicion(x,y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques){
        this.ataques = ataques
    }
}

class Personaje{
    constructor(nombre){
        this.nombre = nombre
    }
}

//cada vez que un cliente solicite un recurso, vamos a hacer algo
//req = require o la peticion y res el cual es la respuesta al usuario
app.get("/unirse", (req, res) =>{
    const id = `${Math.random()}` //se coloca asi `${}` para crear un template y que el numero se convierta en cadena de texto

    const jugador = new Jugador(id)

    jugadores.push(jugador)

    res.setHeader("Access-Control-Allow-Origin", "*")

    res.send(id) //send() nos permite responderle algo al usuario
})

app.post("/personaje/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.personaje || ""
    const personaje = new Personaje(nombre)
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) //verificar que exista el jugador, si no existe regresara -1

    if (jugadorIndex >= 0){ //si existe el jugador, se le asignara su personaje
        jugadores[jugadorIndex].asignarPersonaje(personaje)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

app.post("/personaje/:jugadorId/posicion", (req, res) =>{
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0){ //si existe el jugador, se le asignara su personaje
        jugadores[jugadorIndex].actualizarPosicion(x,y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    //en expressJS solo puedes devolver json, no puedes devolver una lista
    res.send({
        enemigos
    })
})

app.post("/personaje/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) //verificar que exista el jugador, si no existe regresara -1

    if (jugadorIndex >= 0){ //si existe el jugador, se le asignara su personaje
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})


app.get("/personaje/:jugadorId/ataques", (req, res) =>{
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugadorId === jugador.id)
    res.send({
        ataques: jugador.ataques || []
    })
})


// => arrow function
//app.listen(puerto de escucha, funcion)
app.listen(8080, () =>{
    console.log("Servidor Funcionando")
})