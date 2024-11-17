"use client";
import LoginForm from "@/components/LoginForm";


const Login = () => {
    return (
        <>
            <div className="mx-auto max-w-full bg-gradient-to-br from-vivid-cerulean to-oreoles-orange">
                <div className="flex w-full h-screen items-center justify-center">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export default Login;