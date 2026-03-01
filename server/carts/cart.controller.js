import CartService from './cart.service.js';

export const addItemToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;
    const cartService = new CartService();

    try {
        let cart = await cartService.getActiveCart(userId);
        if (!cart) {
            const cartId = await cartService.createCart(userId);
            cart = { cart_id: cartId };
        }

        await cartService.addItemToCart(cart.cart_id, productId, quantity, price);
        res.status(200).json({ status: "success", message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Could not add item to cart" });
    }
};

export const getCartItems = async (req, res) => {
    const { userId } = req.params;
    const cartService = new CartService();

    try {
        const cart = await cartService.getActiveCart(userId);
        if (!cart) {
            return res.status(200).json({ status: "success", items: [] });
        }

        const items = await cartService.getCartItems(cart.cart_id);
        res.status(200).json({ status: "success", items });
    } catch (error) {
        console.error("Error in getCartItems:", error);
        res.status(500).json({ status: "error", message: "Could not retrieve cart items" });
    }
};

export const clearCart = async (req, res) => {
    const { userId } = req.params;
    const cartService = new CartService();

    try {
        const cart = await cartService.getActiveCart(userId);
        if (cart) {
            await cartService.clearCart(cart.cart_id);
            res.status(200).json({ status: "success", message: "Cart cleared" });
        } else {
            res.status(404).json({ status: "error", message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: "Could not clear cart" });
    }
};


export const completeCart = async (req, res) => {
    const { cartId } = req.params;
    const cartService = new CartService();

    try {
        await cartService.completeCart(cartId);
        res.status(200).json({ status: "success", message: "Cart completed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Could not complete cart" });
    }
};

export const removeItemFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    const cartService = new CartService();

    try {
        const cart = await cartService.getActiveCart(userId);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Cart not found" });
        }

        await cartService.removeItemFromCart(cart.cart_id, productId);
        res.status(200).json({ status: "success", message: "Item removed from cart" });
    } catch (error) {
        console.error("Error in removeItemFromCart:", error);
        res.status(500).json({ status: "error", message: "Could not remove item from cart" });
    }
};
