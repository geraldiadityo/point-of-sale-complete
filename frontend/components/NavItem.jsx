"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubNavItem from "./SubNavItem";
import { usePathname } from "next/navigation";
import LoaderSpin from "./LoaderSpin";

const NavItems = ({title, icon, href="#", submenu=false, subMenuItems}) => {

    const [loader, setLoader] = useState(false);
    const [subMenuState, setSubMenuState] = useState(false);
    const pathName = usePathname();
  
    // active navigation menu
    let isActive = pathName === href;
    if (pathName !== href && href !== '/'){
      isActive = pathName.includes(href)
    }
  
    const [active, setActive] = useState(false);
  
    useEffect(() => {
      if(isActive){
        setActive((prev) => !prev);
      }
    }, []);
  
    const togleSubMenu = (e) => {
      if(!submenu){
        if(!isActive)
          setLoader(true);
        return;
      }
        setLoader(false);
        e.preventDefault();
        setSubMenuState((prev) => !prev);
    }
  
    const expandHandler = (chilVal) => {
      setSubMenuState(chilVal);
    }
  
    return (
      <>
      <li key={title}
        className='relative'>
          <div className={`transition-all flex justify-between items-center ${isActive? 'text-flame' : 'text-gray-500 hover:pl-2'} hover:text-flame`} onClick={togleSubMenu}>
            <Link href={href} className='text-sm  py-3 flex flex-row'>
              <i className={icon}> </i>
              <span className='font-bold ml-1 '>{title}</span> {loader && (<span className="ml-1"><LoaderSpin/></span>)}
            </Link> {submenu && (<><i className={`transition-transform bi bi-chevron-right ${subMenuState ? 'rotate-90' : ''} text-sm `}></i></>)} 
          </div>
          {isActive && (<div className="absolute top-1/2 -translate-y-1/2 -right-[10px] lg:-right-[18px] border-transparent border-t-[10px] border-b-[10px] border-r-[10px] border-r-white w-0 h-0">
          </div>)}
      </li>
      {submenu && (
        <ul className={`transition-[max-height] duration-500 ease-in-out px-2 ${subMenuState ? 'h-auto max-h-[2000px]' : 'max-h-0'} overflow-hidden -mx-[26px]`}>
          {subMenuItems.map((item, index) => 
            (
              <SubNavItem
              title={item.title}
              href = {item.href}
              key = {index}
              expandHandler={expandHandler}
              />
            )
          )}
        </ul>)
        }
        </>
    )
  }
  
  export default NavItems;