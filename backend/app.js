import express, { urlencoded } from "express";
import { config } from "dotenv";
import fileUplods from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./Db/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import Order from "./models/orderSchema.js";
import Product from "./models/productSchema.js";
import Payment from "./models/paymentSchema.js";
import OrderItem from "./models/orderItemSchema.js";
import authRouter from "./Routes/authRoutes.js";
import productRouter from "./Routes/productRoute.js";
import adminRouter from "./Routes/adminRoute.js";
import orderRouter from "./Routes/orderRoutes.js";
import Stripe from "stripe";

const app = express();

// set env path -->
config({ path: "./config/config.env" });

// cors setup -->
app.use(
  cors({
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "UPDATE"],
    credentials: true,
  })
);

// Stripe Webhook -->
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handling Successful Payment -->
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const clientSecret = paymentIntent.client_secret;

      try {
        // Update Payment Status -->
        const updatedPayment = await Payment.findOneAndUpdate(
          { client_secret: clientSecret },
          { payment_status: "Paid" },
          { new: true }
        );

        if (!updatedPayment) {
          return res.status(404).send("Payment record not found");
        }

        const orderId = updatedPayment.order_id;

        //  UPDATE ORDER STATUS-->
        const order = await Order.findOneAndUpdate(
          orderId,
          { paid_at: new Date(), order_status: "Processing" },
          { new: true }
        );

        if (!order) {
          return res.status(404).send("Order not Found");
        }

        // 3. FETCH ITEMS: Get all items associated with this order
        const orderedItems = await OrderItem.find({ order_id: orderId });

        // Reducing stock for product -->
        const stockUpdates = orderedItems.map((item) => {
          return Product.findByIdAndUpdate(item.product_id, {
            $inc: { stock: -item.quantity },
          });
        });

        // Run all Stock update in parallel
        await Promise.all(stockUpdates);
      } catch (error) {
        return res
          .status(500)
          .send("`Error updating paid_at timestamp in order table.`");
      }
    }

    res.status(200).send({ received: true });
  }
);

// InbuildMiddleware -->
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// custum middleware -->
app.use(errorMiddleware);

// fileUplods setup -->
app.use(
  fileUplods({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

// connect to database -->
connectToDB();

// auth Api router -->
app.use("/api/v1/auth", authRouter);

// Product Router -->
app.use("/api/v1/product", productRouter);

// admin Api Router -->
app.use("/api/v1/admin", adminRouter);

// Order Api Router -->
app.use("/api/v1/order", orderRouter);

export default app;
