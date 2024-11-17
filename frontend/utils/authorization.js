import Cookies from "universal-cookie";

export const isAdmin = () => {
    const cookies = new Cookies();
    const role = cookies.get('data_login');
    
    return role?.role.nama_role == "Admin";
}

export const isKasir = () => {
    const cookies = new Cookies();
    const role = cookies.get('data_login');
    
    return role?.role.nama_role == "Kasir";
}

export const isRole = (role) => {
    let roleStatus = false;

    switch(role){
        case 'Admin':
            roleStatus = isAdmin();
            break;
        case 'Kasir':
            roleStatus = isKasir();
            break;
        default:
            return false
    }

    return roleStatus;
}

