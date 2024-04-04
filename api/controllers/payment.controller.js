import Payment from "../models/payment.model.js"
import Project from "../models/allocateBudget.model.js";

// Controller to create a new payment
export const createPayment = async (req, res) => {
  try {
    const { projectId, tin, name, amount } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const payment = new Payment({ project: projectId, tin, name, amount });

      await payment.save();
      await project.save();
      res.status(201).json({ success: true, data: payment });
   
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ success: false, error: error.message });
  }
};



// Function to approve a payment
export const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    console.log(payment)
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Mark the payment as approved
    payment.approved = true;
    await payment.save();

    // Update project budget
    const project = await Project.findById(payment.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // if (project.budget >= payment.amount) {
      project.budget -= payment.amount;
      await project.save();
    // } else {
    //   return res.status(400).json({ success: false, error: 'Insufficient project budget' });
    // }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a payment by ID
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tin, name, amount } = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(id, { tin, name, amount }, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a payment by ID
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(id);
    if (!deletedPayment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
