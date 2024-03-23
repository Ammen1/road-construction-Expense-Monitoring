// supplierRouter.js
import express from 'express';
import {  applyForProject } from '../controllers/supplierController.js';

const router = express.Router();


// POST request to apply for a project
router.post('/apply', applyForProject);

export default router;
