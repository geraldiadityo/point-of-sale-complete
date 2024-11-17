"use client";

import LoaderSpin from "../LoaderSpin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import Swal from "sweetalert2";

const FormPegawai = ({ title, post, setPost, method }) => {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const nik = formData.get('nik');
        const nama_lengkap = formData.get('nama_lengkap');
        const alamat = formData.get('alamat');

        const requestBody = JSON.stringify({ nik, nama_lengkap, alamat });

        try {
            const res = await fetch(`${backendhost}/api/pegawai/${method === 'PUT' ? `update-pegawai/${post.id}` : 'create-pegawai'}`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                Swal.fire({
                    icon: "warning",
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
            router.push('/pegawai');
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
                        <label htmlFor="nik">
                            Nik
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="nik"
                                name="nik"
                                className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                                value={post.nik}
                                onChange={(e) => { setPost({ ...post, nik: e.target.value }) }}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="nama_lengkap">
                            Nama Lengkap
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="nama_lengkap"
                                name="nama_lengkap"
                                className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                                value={post.nama_lengkap}
                                onChange={(e) => { setPost({ ...post, nama_lengkap: e.target.value }) }}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="alamat">
                            Alamat
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="alamat"
                                name="alamat"
                                className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                                value={post.alamat}
                                onChange={(e) => { setPost({ ...post, alamat: e.target.value }) }}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-8 text-center lg:text-left">
                        <input type="reset" className="btn-secondary" />
                        <button type="submit" className="btn-primary">
                            {title} {submitting ? (<LoaderSpin />) : ''}
                        </button>
                    </div>
                </div>
            </form>
        </>
    )

}

export default FormPegawai;