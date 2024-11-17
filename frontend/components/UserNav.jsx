"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserNav = ({ pegawai }) => {
    const dropdownRef = useRef();
    const [subMenu, setSubMenu] = useState(false);

    const router = useRouter();

    const closeDropDown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setSubMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeDropDown);


        return () => {
            document.removeEventListener('mousedown', closeDropDown);
        };
    }, []);


    const clickHandler = (e) => {
        router.push('/logout');
    }


    return (
        <>
            <div className="lg:relative text-white cursor-pointer flex items-center lg:min-w-[200px] justify-end" onClick={() => setSubMenu((prev) => !prev)} ref={dropdownRef}>
                <div className="flex items-center">
                    <i className="text-3xl lg:text-xl bi bi-person-circle"></i> <span className="hidden lg:block ml-2">{pegawai.pegawai.nama_lengkap} <i className="bi bi-caret-down-fill text-sm"></i></span>
                </div>
                {
                    subMenu && (
                        <ul className="absolute top-14 lg:top-11 right-2 lg:right-0 text-gunmetal bg-white lg:w-full p-4 rounded-sm shadow">
                            <li>
                                <button className="text-sm font-bold" onClick={clickHandler}>
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </li>
                        </ul>
                    )
                }
            </div>
        </>
    )
}

export default UserNav;
