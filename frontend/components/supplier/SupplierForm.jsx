"use client";
import LoaderSpin from "../LoaderSpin";
import { useState } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import Swal from "sweetalert2";

const SupplierForm = ({ title, method, post, getData, triggerShow }) => {
    const [dataForm, setDataForm] = useState({
        nama_supplier: post.nama_supplier ?? '',
        nomor_telp: post.nomor_telp ?? '',
        alamat: post.alamat ?? '',
        deskripsi: post.deskripsi ?? ''
    });
    const [submitting, setSubmitting] = useState(false);

    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        const nama_supplier = formData.get('nama_supplier');
        const nomor_telp = formData.get('nomor_telp');
        const alamat = formData.get('alamat');
        const deskripsi = formData.get('deskripsi');

        const requestBody = JSON.stringify({ nama_supplier, nomor_telp, alamat, deskripsi });

        try{
            const res = await fetch(`${backendhost}/api/supplier/${method === 'PUT' ? `update-supplier/${post.id}` : 'create-supplier'}`, {
                method: method,
                headers: await headers(),
                body: requestBody
            });

            if(!res.ok){
                const resData = await res.json();
                triggerShow(false);
                Swal.fire({
                    icon: 'warning',
                    title: `Warning ${res.statusText}`,
                    text: resData.message
                });
                return
            }

            const resData = await res.json();
            triggerShow(false);
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
                    <label htmlFor="nama_suppier">
                        Nama Supplier
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="nama_supplier"
                            name="nama_supplier"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={dataForm.nama_supplier}
                            onChange={(e) => setDataForm({...dataForm, nama_supplier: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="nomor_telp">
                        Nomor Telp
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="nomor_telp"
                            name="nomor_telp"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={dataForm.nomor_telp}
                            onChange={(e) => setDataForm({...dataForm, nomor_telp: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="alamat">
                        Alamat
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="alamat"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            name="alamat"
                            value={dataForm.alamat}
                            onChange={(e) => setDataForm({...dataForm, alamat: e.target.value})}
                            cols="5"
                            rows="5"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="deskripsi">
                        {`Deskripsi (*optional)`}
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="deskripsi"
                            name="deskripsi"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={dataForm.deskripsi}
                            onChange={(e) => setDataForm({...dataForm, deskripsi: e.target.value})}
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

export default SupplierForm;
