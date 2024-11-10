// routes/productRoutes.js
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct, getMyProducts, unarchiveProduct, archiveProduct } from '../controllers/productController.js';
import verifyToken from '../services/tokenDecodingService.js';
import multer from 'multer';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });


router.post('/', verifyToken, upload.single('image'), createProduct);
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts); 
router.put('/:id',upload.single('image'), updateProduct);
router.put('/:id/archive', archiveProduct);
router.put('/:id/unarchive', unarchiveProduct);
router.get('/myProducts', verifyToken, getMyProducts);

export default router;