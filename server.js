import express from 'express'
import { ProductManager } from './app.js'
const app = express()
const productsManager = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


const PORT = 8080


// Rutas

// Ruta GET de productros
app.get('/api/productos', async (req, res)=>{
    const {limit, code} = req.query
    console.log(code);
    const products = await productsManager.getProducts(limit)
    res.json(products)
})


app.get('/api/productos/:pid', async (req, res)=>{
    const {pid} = req.params
    const product = await productsManager.getProductById(pid)
    product ? res.send(product) : res.send({error:'Producto no existe en el inventario'})
})

// Ruta POST de productros
app.post('/api/producto', async (req, res)=>{
    const obj = req.body
    const productCreate = await productsManager.addProduct(obj)
    res.json({message:"Producto creado", productCreate})
})

// Ruta PUT de producto
app.put('/api/producto/:pid', async (req, res)=>{
    const {pid} = req.params
    const obj = req.body
    const product = await productsManager.updateProduct(parseInt(pid), obj)
    product ? res.json({message:'Usuario actualizado con exito'}) : res.send({error:'Producto no existe en el inventario'})
    
})

// Ruta DELETE de producto
app.delete('/api/producto/:pid', async (req, res)=>{
    const {pid} = req.params
    const product = await productsManager.deleteProduct(parseInt(pid))
    product ? res.json({message:'Usuario eliminado con exito'}) : res.send({error:'Producto no existe en el inventario'})
    
})


// Ruta de carrito

app.get('/api/carts', async (req, res)=>{
    const {limit} = req.query
    const products = await productsManager.getProducts(limit)
    res.json(products)
})

app.listen(PORT, ()=>{
    console.log('Escuchando express');
})

