import Stripe from "stripe";
import Payment from "../models/paymentSchema.js";


export async function generatePaymentIntent(orderId, totalPrice) {

    try {

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


        // Stripe expect amount in cents( eg , $10.00 -> 1000)
        const amountInCents = Math.round(totalPrice * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency:"usd",
            metadata: { orderId: orderId.toString()}, // Good practice to attach orderId for webhooks -->

        });

        // save Payment details in mongodb -->
        await Payment.create({
            order_id: orderId,
            payment_type: "Online",
            payment_status:"Pending",
            payment_intent_id: paymentIntent.id, //// Usually better to store the ID, not just the secret -->
            client_secret : paymentIntent.client_secret,
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret
        };

    } catch (error) {
        console.error("Payment Error : ", error.message || error);

        return {
            success: false,
            message: "Payment Failed ."
        }
    }
}