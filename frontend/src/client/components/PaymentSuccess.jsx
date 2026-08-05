import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Clock, XCircle, CreditCard } from "lucide-react";
import API from "../api/clientapi.js";

const METHOD_LABELS = {
    VISA: "Visa",
    MASTER: "Mastercard",
    AMEX: "American Express",
    EZCASH: "eZ Cash",
    MCASH: "mCash",
    GENIE: "Genie",
    VISHWA: "Sampath Vishwa",
    PAYAPP: "PayApp",
    HNB: "HNB Bank",
    FRIMI: "FriMi"
};

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("paymentId");

    const [payment, setPayment] = useState(null);
    const [checking, setChecking] = useState(true);
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (!paymentId) {
            setChecking(false);
            return;
        }

        let attempts = 0;
        const maxAttempts = 10; // ~20s of polling while notify webhook lands

        const poll = async () => {
            try {
                const res = await API.get(`/api/payment/${paymentId}`);
                const p = res.data.payment;

                if (p.status !== "pending") {
                    setPayment(p);
                    setChecking(false);
                    return;
                }
            } catch (err) {
                console.error(err);
            }

            attempts += 1;
            if (attempts >= maxAttempts) {
                setChecking(false);
                setTimedOut(true);
            } else {
                setTimeout(poll, 2000);
            }
        };

        poll();
    }, [paymentId]);

    if (!paymentId) {
        return (
            <StatusCard
                icon={<XCircle className="w-10 h-10 text-red-500" />}
                title="Payment reference missing"
                message="We couldn't find a payment reference in the URL."
            />
        );
    }

    if (checking) {
        return (
            <StatusCard
                icon={<Clock className="w-10 h-10 text-[#FCA311] animate-pulse" />}
                title="Confirming your payment..."
                message="This usually takes a few seconds."
            />
        );
    }

    if (timedOut || !payment) {
        return (
            <StatusCard
                icon={<Clock className="w-10 h-10 text-gray-400" />}
                title="Still processing"
                message="Your payment is taking longer than usual to confirm. Check back shortly or contact support with your reference."
                footer={`Reference: ${paymentId}`}
            />
        );
    }

    if (payment.status === "paid") {
        return (
            <StatusCard
                icon={<CheckCircle2 className="w-10 h-10 text-green-500" />}
                title="Payment successful"
                message="Your listing fee has been received."
            >
                <PaymentDetails payment={payment} />
            </StatusCard>
        );
    }

    return (
        <StatusCard
            icon={<XCircle className="w-10 h-10 text-red-500" />}
            title="Payment failed"
            message="Your payment could not be completed. Please try again."
        >
            <PaymentDetails payment={payment} />
        </StatusCard>
    );
};

const StatusCard = ({ icon, title, message, footer, children }) => (
    <div className="max-w-md mt-10 mx-auto bg-white rounded-2xl border border-gray-100 shadow-2xl px-6 py-8 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h2 className="text-lg font-semibold text-[#14213D] mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        {children}
        {footer && <p className="text-xs text-gray-400 mt-4">{footer}</p>}
        <Link
            to="/"
            className="inline-block mt-5 text-sm font-medium text-[#14213D] underline"
        >
            Back to home
        </Link>
    </div>
);

const PaymentDetails = ({ payment }) => (
    <div className="bg-gray-50 rounded-xl px-4 py-3 text-left text-sm space-y-1.5 mt-2">
        <Row label="Amount" value={`LKR ${Number(payment.amount).toLocaleString()}`} />
        <Row
            label="Paid with"
            value={
                payment.payment_method
                    ? (
                        <span className="flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            {METHOD_LABELS[payment.payment_method] || payment.payment_method}
                        </span>
                    )
                    : "—"
            }
        />
        <Row label="Reference" value={payment.transaction_ref || "—"} />
        <Row label="Status" value={payment.status} />
    </div>
);

const Row = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-[#14213D]">{value}</span>
    </div>
);

export default PaymentSuccess;