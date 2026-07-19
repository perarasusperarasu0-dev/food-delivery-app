import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent  (customer)
// Creates a Stripe PaymentIntent for a given order amount.
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // smallest currency unit
      currency: "usd",
      metadata: { orderId: order._id.toString() },
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payments/confirm  (customer)
// Called by the frontend after Stripe confirms payment client-side.
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed" });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", status: "confirmed" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
