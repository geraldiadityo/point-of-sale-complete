"use client";
import { useEffect, useState, useRef } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import LoaderSpin from "@/components/LoaderSpin";
import Swal from "sweetalert2";

const BarangForm = ({ title, post, triggerShow, getData, method }) => {
    const [submitting, setSubmitting] = useState(false);
    const [kodeBarang, setKodeBarang] = useState(post.kode_barang ?? '');
    const [namaBarang, setNamaBarang] = useState(post.nama_barang ?? '');
    const [satuan, setSatuan] = useState(post.satuanId ?? '');
    const [kategori, setKategori] = useState(post.kategoriId ?? '');
    const [satuans, setSatuans] = useState([]);
    const [kategories, setKategories] = useState([]);
    const seletedSatuan = useRef();
    const seletedKategori = useRef();

    const save = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        const kode_barang = formData.get('kode_barang');
        const nama_barang = formData.get('nama_barang');
        const satuanId = parseInt(formData.get('satuan'));
        const kategoriId = parseInt(formData.get('kategori'));

        const requestBody = JSON.stringify({ kode_barang, nama_barang, satuanId, kategoriId });
        
        try{
            const res = await fetch(`${backendhost}/api/barang/${method === 'PUT' ? `update-barang/${post.id}` : 'create-barang/'}`, {
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
                    titleText: resData.message
                });
                return;
            }
            
            const resData = await res.json();
            triggerShow(false)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
            getData();
        } catch (err){
            console.log(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    const getSatuans = async () => {
        const res = await fetch(`${backendhost}/api/satuan/view`, {
            method: 'GET',
            headers: await headers(),
        });
        const data = await res.json();
        setSatuans(data.data);
    };

    const getKategories = async () => {
        const res = await fetch(`${backendhost}/api/kategori/view`, {
            method: 'GET',
            headers: await headers()
        });
        const data = await res.json();
        setKategories(data.data);
    };

    useEffect(() => {
        getSatuans();
        getKategories();
    }, []);

    return (
        <form method="POST" onSubmit={save}>
            <div className="container lg:w-[672px] text-sm">
                <div className="">
                    <label htmlFor="kode_barang">
                        Kode Barang
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="kode_barang"
                            name="kode_barang"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={kodeBarang}
                            onChange={(e) => setKodeBarang(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="nama_barang">
                        Nama Barang
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="nama_barang"
                            name="nama_barang"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={namaBarang}
                            onChange={(e) => setNamaBarang(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="satuan">
                        Satuan
                    </label>
                    <div className="mt-2">
                        <select
                            ref={seletedSatuan}
                            id="satuan"
                            name="satuan"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={satuan}
                            onChange={(e) => setSatuan(e.target.value)}
                        >
                            {satuans && satuans.map((value, index) => (
                                <option key={index} value={value.id} className="py-2 inline-block">{value.nama_satuan}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="kategori">
                        Kategori
                    </label>
                    <div className="mt-2">
                        <select
                            ref={seletedKategori}
                            id="kategori"
                            name="kategori"
                            className="text-sm p-1 w-full lg:w-3/4 border border-x-gunmetal-ligth focus:outline-oreoles-orange/50 rounded-sm"
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                        >
                            {kategories && kategories.map((item, index) => (
                                <option key={index} value={item.id} className="py-2 inline-block">{item.nama_kategori}</option>
                            ))}
                        </select>
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

export default BarangForm;
