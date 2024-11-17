"use client";

import { useRouter, useSearchParams } from "next/navigation";
import InputPassword from "./input/InputPassword";
import { useState } from "react";
import { backendhost } from "@/utils/config";
import Cookies from "universal-cookie";
import { isAdmin, isKasir } from "@/utils/authorization";
import LoaderSpin from "./LoaderSpin";

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [warning, setWarning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitting = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        const requestBody = JSON.stringify({ username, password });

        try {
            const res = await fetch(`${backendhost}/api/auth`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                setWarning(resData.message);
                setTimeout(() => {
                    setWarning('');
                }, 1500);

            }

            const resData = await res.json();
            const cookies = new Cookies();
            cookies.set('Authorization', resData.token);
            cookies.set('data_login', resData.data);

            const nextUrl = searchParams.get("next");

            if(isAdmin){
                router.push(nextUrl ?? "/dashboard")
            } else if (isKasir){
                router.push(nextUrl ?? "/kasir")
            }

            router.refresh();
        } catch (err){
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full lg:w-[270px] bg-white rounded-sm shadow">
            <div className="flex w-full h-[84px] justify-center mt-5">
                Login POS
            </div>
            {warning && (
                <div className="p-5">
                    <span className="text-xs text-red-600">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        {warning}
                    </span>
                </div>
            )}
            <div className="p-5 mt-5 shadow-md">
                <form method="POST" onSubmit={handleSubmitting}>
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-sm text-gray-500">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="border rounded-sm py-1 px-2 focus:outline-oreoles-orange/50"
                            autoComplete="current-username"
                        />
                    </div>
                    <InputPassword />
                    <div className="flex flex-col lg:flex-col mt-4 justify-between lg:items-center">
                        <div className="mt-5 lg:mt-0 text-center lg:text-left">
                            <button type="submit" className="btn-primary">Login {submitting && (<LoaderSpin />)}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;