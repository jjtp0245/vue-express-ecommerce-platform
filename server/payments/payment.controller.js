import PaymentService from './payment.service.js';

export const createPayment = async (req, res) => {
    const { order_id, paymentDate, amount, paymentMethod, paymentStatus } = req.body;
    const paymentProof = req.file ? req.file.filename : null; // ใช้ชื่อไฟล์เป็นหลักฐานการชำระเงิน

    console.log("Received Payment Data:", {
        order_id,
        payment_date: paymentDate,
        amount,
        payment_proof: paymentProof,
        payment_method: paymentMethod,
        payment_status: paymentStatus
    }); // ตรวจสอบข้อมูลที่ได้รับ

    try {
        const result = await new PaymentService().createPayment({
            order_id,
            payment_date: paymentDate,
            amount,
            payment_proof: paymentProof,
            payment_method: paymentMethod,
            payment_status: paymentStatus
        });

        res.status(200).send({
            status: 'success',
            message: 'Payment recorded successfully',
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to record payment',
            cause: error.message,
        });
    }
};

export const getPaymentByOrderId = async (req, res) => {
    const { order_id } = req.params;

    try {
        const result = await new PaymentService().getPaymentByOrderId(order_id);
        res.status(200).send({
            status: 'success',
            message: 'Payment retrieved successfully',
            result: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Failed to retrieve payment',
            cause: error.message
        });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    try {
        const result = await new PaymentService().updatePaymentStatus(order_id, status);
        res.status(200).send({
            status: 'success',
            message: 'Payment status updated successfully',
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to update payment status',
            cause: error.message,
        });
    }
};