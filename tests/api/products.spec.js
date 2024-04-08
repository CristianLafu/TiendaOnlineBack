const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../src/app');
const Product = require('../../src/models/product.model')


describe('Api de products', () => {

    beforeAll(async () => {
        // Conexion a la BD
        await mongoose.connect('mongodb://localhost:27017/tienda_online');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Pruebas GET/api/products', () => {

        let response;
        beforeAll( async () => {
            response = await request(app).get('/api/products').send();
        });

        it('url/api/product', async () => {
            expect(response.statusCode).toBe(200);
        });

        it('la respuesta debe ser en formato JSON', async () => {
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('la respuesta debe ser un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        });

    })

    describe('Pruebas POST/api/products', () => {

        const body = {name: 'Producto prueba', description: 'Esto es una prueba estupenda', price: 120, department: 'test', available: true, stock: 30 }
        let response;
        beforeAll (async () => {
            response = await request(app).post('/api/products').send(body);
        });

        afterAll(() => {
            //DELETE FROM products WHERE department = 'test'
            Product.deleteMany({ department: 'test' });
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('Debería incluir el id en el body de la respuesta', () => {
            expect(response.body._id).toBeDefined();
        });
    })

    describe('Pruebas PUT /api/products', () => {

        const body = {name: 'Producto prueba', description: 'Esto es una prueba estupenda', price: 120, department: 'test', available: true, stock: 30 }
        let response;
        let newProduct;

        beforeAll (async () => {
            //En la BD creamos el producto a modificar
            newProduct = await Product.create(body);
            // Lanzamos la petición de PUT
            response = await request(app)
            .put(`/api/products/${newProduct._id}`)
            .send({
                price: 300,
                department: 'otro'
            });
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });
        
        it('Debería responder con los cambios', () => {
            expect(response.body.price).toBe(300);
            expect(response.body.department).toBe('otro');
        });

        afterAll(async () => {
            await Product.findByIdAndDelete(newProduct._id);
        });


    });

    describe('Pruebas DELETE /api/products', () => {
        const body = { name: 'Producto', description: 'Esto es una prueba estupenda', price: 120, department: 'test', avalible: true, stock: 30 }
        let response;
        let newProduct;

        beforeAll (async () => {
            //En la BD creamos el producto a modificar
            newProduct = await Product.create(body);
            // Lanzamos la petición de PUT
            response = await request(app).delete(`/api/products/${newProduct._id}`).send();         
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });       

        it('Debería desaparecer el producto de la base de datos', async () => {
            const product = await Product.findById(newProduct._id);
            expect(product).toBeNull();
        });


    });

});