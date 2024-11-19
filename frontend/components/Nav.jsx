"use client";

import NavItems from "./NavItem";
import { useState, useEffect } from "react";
import { isAdmin, isKasir } from "@/utils/authorization";

const Nav = ({}) => {
    const [toggleNav, setToggleNav] = useState(false);

    const toggleNavFunc = () => {
        setToggleNav((prev) => !prev);
    }

    const [role, setRole] = useState({
        isAdmin: false,
        isKasir: false
    });

    useEffect(() => {
        setRole({
            isAdmin: isAdmin(),
            isKasir: isKasir()
        })
    }, []);


    return (
        <>
            <nav
                className={`absolute lg:static transition-transform lg:w-[225px] bg-tiffany-blue-light px-2 lg:px-4 ${
                    toggleNav
                    ? "w-[200px]"
                    : "-translate-x-full lg:translate-x-0 w-0 overflow-hidden"}
                    lg:block shadow z-40`}
            >
                <div className="flex items-center justify-between border-b border-vivid-cerulean py-2 lg:hidden">
                    <span className="font-bold text-gunmetal">Menu</span>
                    <button type="button" onClick={toggleNavFunc}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <ul className="pt-2">
                    {role.isAdmin && (
                        <>
                            <NavItems
                                title="Dashboard"
                                icon="bi bi-speedometer2"
                                href="/dashboard"
                            />
                            <NavItems
                                title="Data Master"
                                icon="bi bi-folder"
                                submenu={true}
                                subMenuItems={[
                                    { title: 'Data Pegawai', href:"/pegawai" },
                                    { title: 'Data Pengguna', href:"/pengguna" },
                                    { title: 'Data Role', href:"/role" },
                                    { title: 'Data Kategori', href:"/kategori" },
                                    { title: 'Data Satuan', href:"/satuan" }
                                ]}
                            />
                        </>
                    )}
                    <li></li>
                </ul>
                <hr className="border-gray-400 my-3" />
                <ul className="">
                    <NavItems
                        title="Logout"
                        icon="bi bi-box-arrow-left"
                        href="/logout"
                    />
                </ul>
            </nav>
        </>
    )
}

export default Nav;
