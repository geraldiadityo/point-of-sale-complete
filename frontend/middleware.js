import { NextResponse } from "next/server";
import { verifyJwtToken } from "./utils/auth";
import { cookies } from "next/headers";

const AUTH_PAGES = ["/login"];

const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request){
    const { _url, nextUrl, cookies } = request;
    const { value: token } = cookies.get("Authorization") ?? { value: null };
    
    const { value: _dataLogin } = cookies.get("data_login") ?? { value: null };
    const dataLogin = JSON.parse(_dataLogin);

    const isRole = (role) => {
        return dataLogin?.role.nama_role === role;
    };

    const url = process.env.NEXT_PUBLIC_HOST;

    if(nextUrl.pathname === '/'){
        let urlRole = "";
        if (isRole('Admin')){
            urlRole = "/dashboard"
        } else if (isRole("Kasir")){
            urlRole = "/dashboard"
        } else {
            urlRole = "/dashboard"
        }

        const response = NextResponse.redirect(new URL(urlRole, url));

        return response;
    }

    const hasVerifiedToken = token && ( await verifyJwtToken(token) );
    const isAuthPageRequested = isAuthPages(nextUrl.pathname);

    if(isAuthPageRequested){
        if(!hasVerifiedToken){
            const response = NextResponse.next();
            response.cookies.delete("Authorization");
            return response;
        }

        const response  = NextResponse.redirect(new URL("/dashboard", url));

        return response;
    }

    if(!hasVerifiedToken){
        const searchParams = new URLSearchParams(nextUrl.searchParams);
        searchParams.set("next", nextUrl.pathname);
        
        const response = NextResponse.redirect(
            new URL(`/login?${searchParams}`, url)
        );
        response.cookies.delete("Authorization");

        return response;
    }
}

export const config = {

    matcher: [
        "/",
        "/login",
        "/pegawai/:path*",
        "/dashboard/:path*",
        "/unauthorized",
    ]
}