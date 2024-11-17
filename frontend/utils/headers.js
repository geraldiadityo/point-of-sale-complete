import { token } from "./token";

export const headers = async () => {
    const getToken = await token();
    const _headers = {
        "Authorization": `Bearer ${getToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    return _headers;
}