"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoaderSpin from "./LoaderSpin";
import { useState, useEffect } from "react";

const SubNavItem = ({ title, href, status=false, expandHandler }) => {
    const [loader, setLoader] = useState(false);
    const isActive = usePathname().includes(href);

    useEffect(() => {
        if(isActive){
            expandHandler(isActive)
        }
    },[]);

    const clickHandler = () => {
        if(!isActive){
            setLoader(true);
        }
    }

    return (
        <li className="relative pl-6">
            <Link
                onClick={clickHandler}
                href={href}
                className={`transition-[padding] ${isActive ? 'text-flame' : 'text-gray-500 hover:pl-2'} hover: text-flame text-xs font-bold flex flex-row py-1`}
            >
                <i className="bi bi-chevron-right"></i>
                <span className="">{title}</span> {loader && (<span className="ml-2"><LoaderSpin /></span>)}
            </Link>
            {isActive && (
                <div className="absolute top-1/2 -translate-y-1/2 right-[9px] lg:right-0 border-transparent border-t-[10px] border-b-[10px] border-r-[10px] border-r-white w-0 h-0 z-10"></div>
            )}
        </li>
    )
}

export default SubNavItem