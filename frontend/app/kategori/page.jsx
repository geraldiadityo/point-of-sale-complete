"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import Table from "@/components/Table";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import KategoriForm from "@/components/barang/kategori/KategoriForm";
import { Dialog } from "primereact/dialog";

const KategoriPage = () => {
    const dataInitial = {
        columns: [
            { key: 'nama_kategori', lable: 'Nama Kategori' }
        ],
        data: []
    };

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dataApi, setDataApi] = useState();
    const [data, setData] = useState(dataInitial);
    const [post, setPost] = useState({
        nama_kategori: ''
    });
    const [title, setTitle] = useState("");
    const [method, setMethod] = useState("");


    const getData = async () => {
        const res = await fetch(`${backendhost}/api/kategori/view`, {
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

    const deleteHandler = async (post) => {
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
            const res = await fetch(`${backendhost}/api/kategori/delete-kategori/${post.id}`, {
                method: 'DELETE',
                headers: await headers()
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
            const filteredPost = data.data.filter((p) => p.id !== post.id);
            const newData = { ...data, data: filteredPost };
            setData(newData);
            Swal.fire({
                icon: 'success',
                title: 'Succcess',
                text: resData.message
            });
        }
    }

    const addHandler = () => {
        setTitle("Add");
        setMethod("POST");
        setShowForm(true);
    }

    const editHandler = (e,val) => {
        e.preventDefault();
        setTitle("Update");
        setMethod("PUT");
        setPost({
            id: val.id,
            nama_kategori: val.nama_kategori
        });
        setShowForm(true);
    }

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
    }

    const option = {
        show_page_limit_dropdown: false,
        show_search_input: false
    }

    return (
        <>
            <Dialog
                header={title +' Kategori'}
                visible={showForm}
                style={{ width: 'autor' }}
                onHide={() => setShowForm(false)}
            >
                <KategoriForm
                    post={post}
                    method={method}
                    title={title}
                    trigger={setShowForm}
                    getData={getData}
                />
            </Dialog>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data',
                    },
                    {
                        title: 'Data Kategori',
                        href: '/kategori'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Kategori"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <p className="lg:ml-2 btn-primary cursor-pointer" onClick={() => {addHandler();}}>Add Kategrori</p>
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            nomor={true}
                            pagination={false}
                            options={option}
                            action={opsi}
                        />
                    )}
                </div>
            </section>
        </>
    )

}

export default KategoriPage;
