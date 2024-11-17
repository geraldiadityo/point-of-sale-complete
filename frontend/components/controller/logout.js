import { cookies } from "next/headers";
import Cookies from "universal-cookie";
import { redirect } from "next/navigation";

export const logout = () => {
    // method 1
    cookies().set('Authorization', '');
    cookies().set('data_login', '');

    // method 2
    // const _cookies = new Cookies();
    // _cookies.remove('Authorization');
    // _cookies.remove('data_login');

    return redirect('/login');

}