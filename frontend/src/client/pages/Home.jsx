import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl md:flex-row">
                <div className="bg-[#14213D] px-6 py-10 text-white sm:px-8 md:w-[45%] md:py-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FCA311]">Ceylone Property</p>
                    <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Find your next property with ease.</h1>
                    <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                        Browse premium homes, lands, and rental opportunities from your mobile device.
                    </p>
                </div>

                <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
                    <h2 className="text-xl font-semibold text-slate-800">Welcome back</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Access your dashboard and manage listings quickly from any screen size.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            className="rounded-full bg-[#14213D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f315a]"
                            onClick={() => navigate('/dashboard/client-login')}
                        >
                            Login
                        </button>
                        <button
                            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#FCA311] hover:text-[#FCA311]"
                            onClick={() => navigate('/client-register')}
                        >
                            Create account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
