import fs from 'fs'

export class ProductManager {

  constructor() {
    this.path = './productoslista/products.json'
  }

  async getProducts(limit){
    try{
      if(fs.existsSync(this.path)){
        const infoProducts = await fs.promises.readFile(this.path, 'utf-8')
        if (limit === 'max') {
          const productJS =  JSON.parse(infoProducts)
          return productJS
        } else {
          return JSON.parse(infoProducts).slice(0, limit)
        }
       
      } else {
        return []
      }
    } catch(error){
      console.log(error)
    }

  }


  async addProduct(obj) {
    const {title, description, price, status, code, stock, category} = obj
    const productData = title && description && price && status  && code && stock && category 
    try {
    if(!productData) {
      return console.log({error: 'Error, product incomplete'});
    } else {
        const isCode = await this.#evaluarCode(code)
        if(isCode){
          console.log('That code already exist, try again')
        } else {
          const product = { id: await this.#generarId(), ...obj }
          const productsArchivo = await this.getProducts()
          productsArchivo.push(product)
          await fs.promises.writeFile(this.path, JSON.stringify(productsArchivo))
        } 

    }
    } catch(error) {
      console.log(error)
    } 
  }

  async getProductById(idProduct){
    const products = await this.getProducts()
    const product = products.find( e => e.id === parseInt(idProduct) )
    return product
  }

  async updateProduct(idProduct, obj){
    try {
      const productosArchivo = await this.getProducts()
      const indexProduct = productosArchivo.findIndex((u) => u.id === idProduct)
      console.log(indexProduct);
      if (indexProduct === -1) return
      const productActualizado = { ...productosArchivo[indexProduct], ...obj }
      productosArchivo.splice(indexProduct, 1, productActualizado)
      await fs.promises.writeFile(this.path, JSON.stringify(productosArchivo))
      return productosArchivo
    } catch (error) {
      return error
    }
  }

  async deleteProduct(idProduct){
    let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      const filtrado =read.filter(prod => prod.id != idProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(filtrado, null, 2))
      return filtrado
    }
  }


  async #generarId() {
    const products = await this.getProducts()
    let id =
      products.length === 0
        ? 1
        : products[products.length - 1].id + 1
    return id
  }


  async #evaluarCode(code){
    const products = await this.getProducts()
    return products.find(product => product.code === code)
  }
}
