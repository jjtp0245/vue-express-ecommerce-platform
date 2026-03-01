import OrderService from './order.service.js';

export const createOrder = async (req, res) => {
    const { user_id, order_date, total_amount, shipping_method, shipping_cost, address_id, cartItems } = req.body;
    const order = { user_id, order_date, total_amount, shipping_method, shipping_cost, address_id, order_status: 'awaiting_payment' };

    try {
        // สร้าง order ใหม่
        const result = await new OrderService().createOrder(order);
        const orderId = result.insertId;

        // เตรียมข้อมูล order_items จาก cartItems
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        // แทรกข้อมูลลงตาราง order_items
        await new OrderService().createOrderItems(orderItems);

        res.status(200).send({
            status: 'success',
            message: 'Order created successfully',
            order_id: orderId,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to create order',
            cause: error.message,
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    try {
        const result = await new OrderService().updateOrderStatus(order_id, status);
        res.status(200).send({
            status: 'success',
            message: 'Order status updated successfully',
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to update order status',
            cause: error.message,
        });
    }
};

export const getOrderById = async (req, res) => {
    const { order_id } = req.params;

    try {
        const result = await new OrderService().getOrderById(order_id);
        if (result.length > 0) {
            res.status(200).send({
                status: 'success',
                result: result[0],
            });
        } else {
            res.status(404).send({
                status: 'error',
                message: 'Order not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Failed to retrieve order',
            cause: error.message,
        });
    }
};

export const getUserOrdersWithDetails = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await new OrderService().getOrdersWithDetailsByUserId(user_id);
        if (result.length > 0) {
            res.status(200).send({
                status: 'success',
                result: result,
            });
        } else {
            res.status(404).send({
                status: 'error',
                message: 'ไม่พบข้อมูลออเดอร์สำหรับผู้ใช้ที่ระบุ',
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์',
            cause: error.message,
        });
    }
};

export const deleteOrder = async (req, res) => {
    const { order_id } = req.params;

    try {
        await new OrderService().deleteOrder(order_id);
        res.status(200).send({
            status: 'success',
            message: 'Order deleted successfully',
        });
    } catch (error) {
        console.error("Error deleting order:", error); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            status: 'error',
            message: 'Failed to delete order',
            cause: error.message,
        });
    }
};

export const getOrderCount = async (req, res) => {
    try {
        const count = await new OrderService().countOrders();
        res.status(200).send({
            status: "success",
            code: 1,
            result: {
                totalOrders: count,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};
export const getOrders = async (req, res) => {
    try {
        const orders = await new OrderService().getAllOrders();
        res.status(200).send({
            status: 'success',
            result: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch orders',
            cause: error.message
        });
    }
};

