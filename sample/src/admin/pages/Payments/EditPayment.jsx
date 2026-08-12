import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import {
    getPaymentById,
    updatePayment
} from "../../api/paymentApi";
import Loader from "../../components/Loader";

const EditPayment = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [form, setForm] = useState({

        amount: "",
        currency: "",
        payment_method: "",
        payment_gateway: "",
        transaction_ref: "",
        paid_at: "",
        status: "pending"

    });

    useEffect(() => {

        loadPayment();

    }, [id]);

    const loadPayment = async () => {

        try {

            const res = await getPaymentById(id);

            const payment = res.data.payment;

            setForm({

                amount: payment.amount,
                currency: payment.currency,
                payment_method: payment.payment_method || "",
                payment_gateway: payment.payment_gateway || "",
                transaction_ref: payment.transaction_ref || "",
                paid_at: payment.paid_at || "",
                status: payment.status

            });

        } catch (error) {

            toast.error("Failed to load payment");

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

      // =====================================================
        // LOADING
        // =====================================================
    
        if (loading) {
    
            return <Loader />;
    
        }

    return (

        <div className="space-y-6">

            <div className="flex justify-between">

                <h1 className="text-3xl font-bold">
                    Edit Payment
                </h1>

                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <ArrowLeft size={18}/>
                    Back
                </button>

            </div>

            {/* Form will be added next */}

        </div>

    );

};

export default EditPayment;