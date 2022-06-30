import express from 'express'
//const { Server : ioServer } = require('socket.io')
import http from 'http'
const app = express()
import multer from 'multer'
import desafioFaker from './desafioFaker.js'
// const routesProductos = require("./routes/routes-productos.js")
// import mensajesRoutes from "./routes/routes-mensajes"
// import { Router } from 'express';
// import Api from './apiClassMensajes'
import { options } from './dataBases/configDB.js';
import knex from 'knex'

// const router = Router()
// const api = new Api(options.mariaDB,'mensajes')

// const isAdmin = true

// function adminOrClient(req,res,next){
//     if(!isAdmin){
//         res.send("No tienes acceso a esta ruta")
//     } else {
//         next()
//     }
// }

const httpServer = http.createServer(app)
//const io = new ioServer(httpServer)

app.use(multer({
    dest:__dirname+"/public/files",

}).single("photo"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
//app.use('/productos', routesProductos)
app.set('views','./views')
app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.render('index', {
        title:"Agregue un producto"
    })
})

knex(options).schema.createTableIfNotExists('productos', (table) =>{
    table.increments('id').primary()
    table.string('nombre')
    table.string('descripcion')
    table.integer('precio')
    table.integer('cantidad')
}).then(()=>{console.log('Tabla creada')}).catch((err) => {console.log(err)})

const productos = []

const mensajes = []



// io.on('connection',(socket)=>{
//     console.log('nuevo cliente conectado', socket.id)
//     socket.emit('productos',productos)
//     socket.emit('mensajes', mensajes)

//     socket.on("newProducto", producto => {
//         productos.push(producto)
//         io.sockets.emit('productos', productos)
//     })

//     socket.on('newMessage', mensaje => {
//         mensajes.push(mensaje)
//         router.post('/',adminOrClient, async (req,res) => {
//             const obj = mensajes
//             const product = await api.create(obj)
//             res.json(product)
//         })
//         io.sockets.emit('mensajes',mensajes)
//     })
// })

//export default mensajes

app.use('/api/productos-test', desafioFaker)

const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`)
})