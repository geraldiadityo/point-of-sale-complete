"use client";
import UserNav from "./UserNav";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";

const TopBar = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        const cookies = new Cookies();
        const getUser = cookies.get("data_login");
        setUser(getUser);
    }, []);

    return (
        <section className="bg-vivid-cerulean shadow sticky top-0 right-0 z-50">
            <div className="container max-w-full mx-auto py-2 px-2 lg:px-4 flex items-center  justify-between">
                <div className="brand flex items-center">
                    <div className="flex w-[32px] h-[32px]">
                        POS
                    </div>
                    <h1 className="font-bold text-white px-2">Point Of Sale</h1>
                </div>
                <div className="flex">
                    <i className="bi bi-list text-white text-3xl mr-2 lg:hidden cursor-pointer"></i>
                    {user && (
                        <UserNav
                            pegawai={user}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopBar;
