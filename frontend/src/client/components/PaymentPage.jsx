import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import API from "../api/clientapi.js";

const PaymentPage = ({ clientId, propertyType, propertyId, amount, listingLabel }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {

        if (!window.payhere) {
            setError("Payment gateway failed to load. Please refresh and try again.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await API.post("/api/payment/create-payment", {
                client_id: clientId,
                property_type: propertyType,
                property_id: propertyId,
                amount
            });

            const data = response.data.payment;

            window.payhere.onCompleted = function (orderId) {
                console.log("Payment completed:", orderId);
                // return_url below already carries the payment id
            };

            window.payhere.onDismissed = function () {
                console.log("Payment cancelled");
                setLoading(false);
            };

            window.payhere.onError = function (err) {
                console.error("Payment error:", err);
                setError("Payment failed. Please try again.");
                setLoading(false);
            };

            const payment = {
                sandbox: true,
                merchant_id: data.merchant_id,
                return_url: `http://localhost:5173/payment-success?paymentId=${data.payment_id}`,
                cancel_url: "http://localhost:5173/payment-cancel",
                notify_url: "http://localhost:5000/api/payment/notify",
                order_id: String(data.payment_id),
                items: listingLabel || "Property Listing Fee",
                amount: data.amount,
                currency: data.currency,
                first_name: "Kavindi",
                last_name: "Arunika",
                email: "kavindiarunika26@gmail.com",
                phone: "0770176493",
                address: "Sri Lanka",
                city: "Colombo",
                country: "Sri Lanka",
                hash: data.hash
            };

            window.payhere.startPayment(payment);

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Could not start payment. Please try again."
            );
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mt-10 mx-auto bg-white/80 rounded-2xl border border-gray-100 overflow-hidden shadow-2xl">

            <div className="bg-[#14213D] px-6 py-5">
                <p className="text-[11px] font-semibold tracking-wide uppercase text-[#FCA311] mb-1">
                    Secure Checkout
                </p>
                <h2 className="text-white text-lg font-semibold">
                    Complete Your Payment
                </h2>
            </div>

            <div className="px-6 py-5">

                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 mb-5">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Property listing fee</p>
                        <p className="text-sm font-medium text-[#14213D]">{listingLabel || "Listing"}</p>
                    </div>
                    <p className="text-xl font-bold text-[#14213D]">
                        LKR {Number(amount).toLocaleString()}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                        {error}
                    </div>
                )}

                <p className="text-xs text-gray-500 mb-4">
                    You'll be redirected to PayHere's secure checkout to choose your payment method and enter your details.
                </p>

                <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-[#FCA311] hover:bg-[#e6940a] disabled:opacity-60 disabled:cursor-not-allowed text-[#14213D] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <Lock className="w-4 h-4" />
                    {loading ? "Processing..." : `Pay LKR ${Number(amount).toLocaleString()}`}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4 text-gray-400">
                    <div className="flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        PCI-DSS compliant
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                        <Lock className="w-3.5 h-3.5" />
                        256-bit SSL
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;