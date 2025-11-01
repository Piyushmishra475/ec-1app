

import express from 'express'
import {listProduct, removeProduct, singleProduct, addProduct} from '../controllers/ProductController.js'
import upload from '../middleware/Multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,addProduct,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]));
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',adminAuth,singleProduct);
productRouter.get('/list',listProduct);

export default productRouter