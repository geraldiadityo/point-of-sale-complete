import Cookies from "universal-cookie";

export async function token() {
    const cookies = new Cookies();
    const token = cookies.get('Authorization');

    return token;
}