"use client";

import LoaderSpin from "../LoaderSpin";
import { useEffect, useState, useRef } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { InputText } from 'primereact/inputtext';
import InputPassword from "../input/InputPassword";
import Swal from "sweetalert2";

const FormAkun = ({ title, post, setPost, method, data, idPegawai, setShow }) => {
    const [passwordConfirm, setPasswordConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newusername, setNewusername] = useState(data?.usename ?? '');
    const [newpassword, setNewpassword] = useState('');
    const [ulangipassword, setUlangipassword] = useState('');
    const [role, setRole] = useState();
    const [roles, setRoles] = useState([]);
    const selectedRole = useRef();

    const save = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('newusername');
        const password = formData.get('newpassword');
        const confirm_password = formData.get('ulangipassword');
        const roleId = parseInt(formData.get('role'));
        const pegawaiId = parseInt(idPegawai);

        if(password !== confirm_password){
            setPasswordConfirm(true);
            setSubmitting(false);
            setTimeout(() => {
                setPasswordConfirm(false);
            }, 1500);

            return;
        }

        const requestBody = JSON.stringify({ username, password, confirm_password, roleId, pegawaiId });

        try {
            const res = await fetch(`${backendhost}/api/pengguna/create-pengguna`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            const akun = await res.json();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: akun.message
            });
            setShow(false);
        } catch (err){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
            setShow(false);
        }
    }

    useEffect(() => {
        const getRoles = async () => {
            const dataApi = await fetch(`${backendhost}/api/role/view`, {
                method: 'GET',
                headers: await headers()
            });

            const data = await dataApi.json();
            setRoles(data.data);
        }

        getRoles()
    }, []);


    return (
        <>
            {passwordConfirm && (
                <div className="my-[10px] rounded-lg bg-red-200 text-red-950 border-l-2 text-xs p-4 border-l-red-950">
                    <i className="bi bi-exclamation-diamond-fill"></i> <span>Konfirmasi Password Tidak Sama</span>
                </div>
            )}

            <form method="POST" onSubmit={save} autoComplete="off">
                <div className="container lg:w-full text-sm">
                    <div className="mt-2">
                        <label htmlFor="pegawaiId">
                            Id Pegawai
                        </label>
                        <div className="mt-2">
                            <InputText
                                id="pegawaiId"
                                name="pegawaiId"
                                defaultValue={idPegawai}
                                className="px-2 py-1 border border-gray-300 w-full"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="username">
                            Username
                        </label>
                        <div className="mt-2">
                            <InputText
                                id="username"
                                name="newusername"
                                value={newusername}
                                onChange={(e) => setNewusername(e.target.value)}
                                required

                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="newpassword">
                            Password
                        </label>
                        <div className="mt-2">
                            <InputPassword
                                id="newpassword"
                                value={newpassword}
                                onChange={setNewpassword}
                                label={false}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="ulangipassword">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <InputPassword
                                id="ulangipassword"
                                value={ulangipassword}
                                onChange={setUlangipassword}
                                label={false}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="role">
                            Role
                        </label>
                        <div className="mt-2">
                            <select
                                ref={selectedRole}
                                name="role"
                                id="role"
                                className="p-1 text-sm border w-full border-x-tiffany-blue-light focus:outline-oreoles-orange/50 rounded-sm"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                {roles && roles.map((value, index) => (
                                    <option key={index} value={value.id} className="py-2 inline-block">{value.nama_role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 text-center lg:text-left">
                        <input type="reset" className="btn-secondary" />
                        <button type="submit" className="btn-primary">{title ?? 'Add'} {submitting  ? (<LoaderSpin />) : ''}</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default FormAkun;
