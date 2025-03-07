"use client";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { Tooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import SatuanForm from "@/components/barang/satuan/SatuanForm";
import Swal from "sweetalert2";
import Table from "@/components/Table";

const SatuanPage = () => {
    const dataInitial = {
        columns: [
            { key: 'nama_satuan', lable: 'Nama Satuan' }
        ],
        data: []
    };

    const [showForm, setShowForm] = useState(false);
    const [dataApi, setDataApi] = useState();
    const [data, setData] = useState(dataInitial);
    const [post, setPost] = useState({
        nama_satuan: ''
    });
    const [title, setTitle] = useState("");
    const [method, setMethod] = useState("");

    const getData = async () => {
        const res = await fetch(`${backendhost}/api/satuan/view`, {
            method: 'GET',
            headers: await headers()
        });

        if(res.ok){
            const resData = await res.json();
            setDataApi(resData.data);
        }
    }

    useEffect(() => {
        getData()
    }, []);
    
    useEffect(() => {
        if(!dataApi) return;

        setData({...dataInitial, data: dataApi});
    }, [dataApi]);

    const deleteHandler = async (val) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin menghapus data kategori ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/satuan/delete-satuan/${val.id}`, {
                method: 'DELETE',
                headers: await headers()
            });

            if(!res.ok){
                const resData = await res.json()
                Swal.fire({
                    icon: 'warning',
                    title: `Warning`,
                    text: resData.message
                });
                return;
            }
            const resData = await res.json();
            const filteredData = data.data.filter((item) => item.id != val.id);
            const newData = { ...data, data: filteredData }
            setData(newData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    }

    const addHandler = () => {
        setTitle("Add");
        setMethod("POST");
        setPost({
            nama_satuan: ''
        });
        setShowForm(true);
    };

    const editHandler = (e, val) => {
        e.preventDefault();
        setMethod("PUT");
        setTitle("Update");
        setPost({
            id: val.id,
            nama_satuan: val.nama_satuan
        });
        setShowForm(true);
    };

    const opsi = (val) => {
        return (
            <td>
                <div className="justify-center">
                <div className="">
                        <span className="edit px-1 cursor-pointer text-blue-950 hover:text-flame" onClick={(e) => editHandler(e, val)}><i className="bi bi-pencil-square"></i></span>
                        <Tooltip anchorSelect=".edit" place="top">Edit</Tooltip>
                    </div>
                    <div className="">
                        <p className="hapus px-1 cursor-pointer text-orang-950 hover:text-flame" onClick={(e) => deleteHandler(val)}><i className="bi bi-trash"></i></p>
                        <Tooltip anchorSelect=".hapus" place="top">Hapus</Tooltip>
                    </div>
                </div>
            </td>
        )
    };

    const options = {
        show_page_limit_dropdown: false,
        show_search_input: false
    };

    return (
        <>
            <Dialog
                header={`Form ${title} Satuan`}
                visible={showForm}
                style={{ width: 'auto' }}
                onHide={() => setShowForm(false)}
            >
                <SatuanForm
                    title={title}
                    method={method}
                    getData={getData}
                    triggerShow={setShowForm}
                    post={post}
                />
            </Dialog>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data',
                    },
                    {
                        title: 'Data Satuan',
                        href: '/satuan'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title='Data Satuan'
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <p className="lg:ml-2 cursor-pointer btn-primary" onClick={() => {addHandler()}}>Add Satuan</p>
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            nomor={true}
                            pagination={false}
                            options={options}
                            action={opsi}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default SatuanPage;
