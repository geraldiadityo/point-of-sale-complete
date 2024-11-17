"use client";

import LoaderSpin from "../LoaderSpin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { headers } from "@/utils/headers";
import { backendhost } from "@/utils/config";
import Swal from "sweetalert2";

const FormRole = ({ title, post, setPost, method }) => {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const nama_role = formData.get('nama_role');
        
        const requestBody = JSON.stringify({ nama_role });

        try {
            const res = await fetch(`${backendhost}/api/role/${method === 'PUT' ? `update-role/${post.id}` : 'create-role'}`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                Swal.fire({
                    icon: 'warning',
                    title: `Warning ${res.statusText}`,
                    text: resData.message
                });
                return;
            }
            const resData = await res.json();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
            router.push('/role');
            router.refresh();
        } catch (err){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <form method="POST" onSubmit={save}>
                <div className="container lg:w-[672px] text-sm">
                    <div className="">
                        <label htmlFor="nama_role">
                            Nama Role
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nama_role"
                                id="nama_role"
                                className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                                value={post.nama_role}
                                onChange={(e) => { setPost({ ...post, nama_role: e.target.value }) }}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-8 text-center lg:text-left">
                        <input type="reset" className="btn-secondary" />
                        <button type="submit" className="btn-primary">{title} {submitting ? (<LoaderSpin />) : ''}</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default FormRole;