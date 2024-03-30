// supplierRouter.js
import express from 'express';
import {  applyForProject, getAllApplications, getAllApplication, approve, deleteSupplier, editSupplier } from '../controllers/supplierController.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();


// POST request to apply for a project
router.post('/apply', verifyToken,  applyForProject);
router.get('/applications',verifyToken,  getAllApplications);
router.get('/application/:userId', verifyToken, getAllApplication);
router.put('/application/:applicationId', approve);
router.delete('/application/:applicationId',  deleteSupplier);
router.put('/application/:applicationId', editSupplier);


export default router;
