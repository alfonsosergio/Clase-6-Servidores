import express from 'express'
import { ProductManager } from './app.js'
const app = express()
const productsManager = new ProductManager()


const PORT = 3434


// Rutas


app.get('/productos', async (req, res)=>{
    const {limit} = req.query
    const products = await productsManager.getProducts(limit)
    res.json(products)
})


app.get('/productos/:pid', async (req, res)=>{
    const {pid} = req.params
    const product = await productsManager. getProductById(pid)
    res.send(product)
})



app.listen(PORT, ()=>{
    console.log('Eschcando express');
})

