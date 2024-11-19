"use client";
import LoaderSpin from "@/components/LoaderSpin";
import { useState } from "react";
import { headers } from "@/utils/headers";
import { backendhost } from "@/utils/config";
import Swal from "sweetalert2";

const SatuanForm = ({ title, post, triggerShow, getData, method }) => {
    const [submitting, setSubmitting] = useState(false);
    const [namaSatuan, setNamaSatuan] = useState(post.nama_satuan ?? '');
    
    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const nama_satuan = formData.get('nama_satuan');
        
        const requestBody = JSON.stringify({ nama_satuan });
        
        try{
            const res = await fetch(`${backendhost}/api/satuan/${method === 'PUT' ? `update-satuan/${post.id}` : 'create-satuan'}`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                triggerShow(false);
                Swal.fire({
                    icon:'warning',
                    title: `Warning ${res.statusText}`,
                    text: resData.message
                });
                return;
            }

            const resData = await res.json();
            triggerShow(false);
            Swal.fire({
                icon: 'success',
                title: `Success`,
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
                    <label htmlFor="nama_satuan">
                        Nama Satuan
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="nama_satuan"
                            name="nama_satuan"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={namaSatuan}
                            onChange={(e) => setNamaSatuan(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="mt-8 text-center lg:text-left">
                    <input  type="reset" className="btn-secondary" />
                    <button type="submit" className="btn-primary">{title} {submitting ? (<LoaderSpin />) : ''}</button>
                </div>
            </div>
        </form>
    )
}

export default SatuanForm;
