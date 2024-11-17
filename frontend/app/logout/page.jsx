"use client";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    
    useEffect(() => {
        const logout = async () => {
            const cookies = new Cookies();
            cookies.remove('Authorization');
            cookies.remove('data_login');
            router.push('/login');
            router.refresh();
        }

        logout()
    }, []);


    return (
        <div>Logout ...</div>
    )
}

export default Page;
