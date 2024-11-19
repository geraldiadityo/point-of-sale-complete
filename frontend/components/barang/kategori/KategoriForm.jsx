"use client";
import LoaderSpin from "@/components/LoaderSpin";
import { useState } from "react";
import { headers } from "@/utils/headers";
import { backendhost } from "@/utils/config";
import Swal from "sweetalert2";

const KategoriForm = ({ title, post, setPost, method, trigger, getData }) => {
    const [submitting, setSubmitting] = useState(false);
    const [namaKategori, setNamaKategori] = useState(post.nama_kategori ?? '');
    
    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const nama_kategori =  formData.get('nama_kategori');

        const requestBody = JSON.stringify({ nama_kategori });

        try{
            const res = await fetch(`${backendhost}/api/kategori/${method === 'PUT' ? `update-kategori/${post.id}` : 'create-kategori'}`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                trigger(false);
                Swal.fire({
                    icon: 'error',
                    title: `Waring: ${res.statusText}`,
                    text: resData.message
                })
            }

            const resData = await res.json();
            trigger(false);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
            getData();
        } catch (err){
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form method="POST" onSubmit={save}>
            <div className="container lg:w-[672px] text-sm">
                <div className="">
                    <label htmlFor="nama_kategori">
                        Nama Kategori
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="nama_kategori"
                            name="nama_kategori"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={namaKategori}
                            onChange={(e) => setNamaKategori(e.target.value)}
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
    )

}

export default KategoriForm;
