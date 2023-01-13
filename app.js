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
          return JSON.parse(infoProducts)
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


  async addProduct(title, description, price, thumbnail, code, stock) {
    const productData = !title || !description || !price || !thumbnail || !code || !stock
    try {
    if(!productData) {
      return console.log({error: 'Error, product incomplete'});
    } else {
        const isCode = this.#evaluarCode(code)
        if(isCode){
          console.log('That code already exist, try again')
        } else {
          const product = {
            id: this.#generarId(), 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          }
          this.products.push(product)
          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
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

  async updateProduct(idProduct, change){
    let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      product = {...product, ...change}
      read = read.map(prod => {
        if(prod.id == product.id){
          prod = product
        }
        return prod
      })
      read = JSON.stringify(read, null, 2)
      await fs.promises.writeFile(this.path, read)
      console.log(JSON.parse(read))
      return read
    }else{
      return null
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


  #generarId() {
    let id =
      this.products.length === 0
        ? 1
        : this.products[this.products.length - 1].id + 1
    return id
  }


  #evaluarCode(code){
    return this.products.find(product => product.code === code)
  }
}


