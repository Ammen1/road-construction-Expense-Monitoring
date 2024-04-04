import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  approvePayment,
} from "../controllers/payment.controller.js"

const router = express.Router();

// Route to create a new payment
router.post('/payments/create', createPayment);

// Route to get all payments
router.get('/payments', getAllPayments);
router.put('/payments/:paymentId/approve', approvePayment);

// Route to get a single payment by ID
router.get('/payments/:id', getPaymentById);

// Route to update a payment by ID
router.put('/payments/:id', updatePayment);

// Route to delete a payment by ID
router.delete('/payments/:id', deletePayment);

export default router;
