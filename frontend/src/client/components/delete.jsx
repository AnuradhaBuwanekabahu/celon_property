import React from "react";
import { Lock, ShieldCheck } from "lucide-react";
import API from "../../api/clientapi.js";


const PaymentPage = () => {


    const handlePayment = async()=>{


        try{


            // Create payment in backend

            const response = await API.post(
                "/payment/create-payment",
                {
                    client_id:1,
                    property_type:"hot_sales",
                    property_id:10,
                    amount:2500
                }
            );


            const data = response.data.payment;



            // PayHere configuration

            const payment = {

                sandbox:true,

                merchant_id:data.merchant_id,

                return_url:
                "http://localhost:5173/payment-success",

                cancel_url:
                "http://localhost:5173/payment-cancel",

                notify_url:
                "http://localhost:5000/api/payment/notify",


                order_id:
                data.payment_id,


                items:
                "Property Listing Fee",


                amount:
                data.amount,


                currency:
                "LKR",


                first_name:
                "Kavindi",


                last_name:
                "Arunika",


                email:
                "user@gmail.com",


                phone:
                "0771234567",


                address:
                "Sri Lanka",


                city:
                "Colombo",


                country:
                "Sri Lanka",


                hash:
                data.hash

            };



            window.payhere.startPayment(payment);



        }
        catch(error){

            console.log(error);

        }

    }



    return (

        <div className="max-w-3xl mt-10 mx-auto bg-white rounded-2xl shadow-xl">


            <div className="bg-[#14213D] px-6 py-5">

                <p className="text-[#FCA311] text-xs">
                    Secure Checkout
                </p>

                <h2 className="text-white text-lg">
                    Complete Your Payment
                </h2>

            </div>



            <div className="p-6">


                <div className="flex justify-between bg-gray-50 p-4 rounded-xl">

                    <div>

                        <p className="text-gray-500 text-sm">
                            Property Listing Fee
                        </p>

                        <p className="font-semibold">
                            HS-108
                        </p>

                    </div>


                    <p className="text-xl font-bold">
                        LKR 2500
                    </p>


                </div>




                <button

                onClick={handlePayment}

                className="
                mt-5
                w-full
                bg-[#FCA311]
                py-3
                rounded-xl
                font-semibold
                text-[#14213D]
                flex
                justify-center
                gap-2
                "

                >

                    <Lock size={18}/>

                    Pay With PayHere


                </button>




                <div className="flex justify-center gap-4 mt-4 text-gray-400 text-xs">

                    <div className="flex gap-1">
                        <ShieldCheck size={14}/>
                        PCI-DSS
                    </div>


                    <div className="flex gap-1">
                        <Lock size={14}/>
                        SSL Secure
                    </div>


                </div>


            </div>


        </div>

    );

};


export default PaymentPage;