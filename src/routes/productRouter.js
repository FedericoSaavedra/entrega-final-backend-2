import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import ProductRepository from '../repositories/ProductRepository.js'; 
import { uploader } from '../utils/multerUtil.js';

const router = Router();

// 1. Instanciamos el DAO (Data Access Object)
const productDao = new productDBManager();

// 2. Inyectamos el DAO en el Repository
// A partir de aquí, el router SOLO habla con el Repository
const productsService = new ProductRepository(productDao);



router.get('/', async (req, res) => {
    // Usamos el repositorio
    const result = await productsService.getAll(req.query);

    res.send({
        status: 'success',
        payload: result
    });
});

router.get('/:pid', async (req, res) => {
    try {
        const result = await productsService.getById(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.path);
        });
    }

    try {
        const result = await productsService.create(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productsService.update(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await productsService.delete(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;