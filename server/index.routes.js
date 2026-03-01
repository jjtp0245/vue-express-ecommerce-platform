import { Router } from "express";
import users from "./users/user.routes.js";
import categories from "./categories/category.routes.js"
import products from "./products/product.routes.js";
import brands from "./brands/brand.routes.js";
import addresses from "./addresses/address.routes.js";
import carts from "./carts/cart.routes.js";
import orders from "./orders/order.routes.js";
import payments from "./payments/payment.routes.js";

const routes = Router();


routes.use("/user", users);
routes.use("/category", categories);
routes.use("/product", products);
routes.use("/brand", brands);
routes.use("/address", addresses);
routes.use("/cart", carts);
routes.use("/order", orders);
routes.use("/payment",payments);


export default routes;