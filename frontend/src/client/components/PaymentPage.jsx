import React from 'react';
import { CreditCard, Building2, Lock, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
    return (
        <div className="max-w-3xl mt-10 mx-auto bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

            {/* Header */}
            <div className="bg-[#14213D] px-6 py-5">
                <p className="text-[11px] font-semibold tracking-wide uppercase text-[#FCA311] mb-1">
                    Secure Checkout
                </p>
                <h2 className="text-white text-lg font-semibold">
                    Complete Your Payment
                </h2>
            </div>

            <form className="px-6 py-5">

                {/* Order summary */}
                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 mb-5">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Property listing fee</p>
                        <p className="text-sm font-medium text-[#14213D]">HS-108</p>
                    </div>
                    <p className="text-xl font-bold text-[#14213D]">LKR 2,500</p>
                </div>

                {/* Payment method toggle */}
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border border-[#14213D] bg-gray-50 text-[#14213D] font-medium"
                    >
                        <CreditCard className="w-4 h-4" />
                        Credit card
                    </button>
                    <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-500"
                    >
                        <Building2 className="w-4 h-4" />
                        Debit card
                    </button>
                </div>

                {/* Card number */}
                <div className="mb-3.5">
                    <label className="block text-xs text-gray-500 mb-1">Card number</label>
                    <div className="relative">
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="4111 1111 1111 1111"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />
                    </div>
                </div>

                {/* Cardholder name */}
                <div className="mb-3.5">
                    <label className="block text-xs text-gray-500 mb-1">Cardholder name</label>
                    <input
                        type="text"
                        placeholder="Kavindi Arunika"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                </div>

                {/* Expiry + CVV */}
                <div className="flex gap-3 mb-5">
                    <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Expiry</label>
                        <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">CVV</label>
                        <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />
                    </div>
                </div>

                {/* Pay button */}
                <button
                    type="submit"
                    className="w-full bg-[#FCA311] hover:bg-[#e6940a] text-[#14213D] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <Lock className="w-4 h-4" />
                    Pay LKR 2,500
                </button>

                {/* Trust signals */}
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

            </form>
        </div>
    );
};

export default PaymentPage;
