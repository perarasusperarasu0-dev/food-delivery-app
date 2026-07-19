import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Replace with your Stripe publishable key (starts with pk_test_...)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_replace_me");

function CheckoutForm() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || "");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setProcessing(true);
    try {
      // 1. Create the order in our own database
      const orderPayload = {
        items: items.map((i) => ({ menuItem: i.menuItem, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount,
        deliveryAddress: address,
      };
      const { data: order } = await api.post("/orders", orderPayload);

      // 2. Ask our backend to create a Stripe PaymentIntent for that order
      const { data: intentData } = await api.post("/payments/create-intent", { orderId: order._id });

      // 3. Confirm the card payment on the client
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      // 4. Tell our backend the payment succeeded
      await api.post("/payments/confirm", {
        orderId: order._id,
        paymentIntentId: result.paymentIntent.id,
      });

      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="ticket p-6 border border-surface2 flex flex-col gap-4">
      {error && <p className="text-chili text-sm">{error}</p>}
      <label className="text-sm text-muted">Delivery address</label>
      <input
        required value={address} onChange={(e) => setAddress(e.target.value)}
        className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili"
      />
      <label className="text-sm text-muted mt-2">Card details</label>
      <div className="bg-ink border border-surface2 rounded-lg px-4 py-3">
        <CardElement options={{ style: { base: { color: "#F5EFE4", fontSize: "16px", "::placeholder": { color: "#9A9285" } } } }} />
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-surface2 pt-4 mt-2">
        <span>Total</span>
        <span className="font-display text-chili text-lg">${totalAmount.toFixed(2)}</span>
      </div>
      <button
        type="submit" disabled={!stripe || processing}
        className="bg-chili text-ink font-semibold rounded-full py-3 hover:brightness-110 transition disabled:opacity-50"
      >
        {processing ? "Processing…" : `Pay $${totalAmount.toFixed(2)}`}
      </button>
      <p className="text-xs text-muted text-center">
        Test mode — use card 4242 4242 4242 4242, any future date/CVC.
      </p>
    </form>
  );
}

export default function Checkout() {
  const { items } = useCart();
  if (items.length === 0) {
    return <p className="max-w-md mx-auto mt-16 text-muted text-center">Your cart is empty.</p>;
  }
  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl mb-6 text-center">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
