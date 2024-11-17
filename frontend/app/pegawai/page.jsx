"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { backendhost } from "@/utils/config";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import LoaderSpin from "@/components/LoaderSpin";
import Table from "@/components/Table";
import { useFromTo } from "@/utils/function";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import { headers } from "@/utils/headers";
import { Dialog } from 'primereact/dialog';
import FormAkun from "@/components/akun/FormAkun";

const PegawaiPage = () => {
    const dataInitial = {
        columns: [
            { key: 'id', lable: 'Id' },
            { key: 'nk', lable: 'Nomor Karyawan' },
            { key: 'nik', lable: 'NIK' },
            { key: 'nama_lengkap', lable: 'Nama Lengkap' },
            { key: 'alamat', lable: 'Alamat' }
        ],
        metadata: {
            counts: 0,
            page: 1,
            limit: 25,
            from: 0,
            to: 0
        },
        data: []
    };

    const [showAddAkunDialog, setShowAddAkunDialog] = useState(false);

    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState();
    const [id, setId] = useState();

    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        keyword: ''
    });
    const debounceKeyword = useDebounce(urlQuery.keyword, 500);


    const getData = async () => {
        let host = '';
        if(debounceKeyword !== ''){
            host = `${backendhost}/api/pegawai/search-pegawai?keyword=${debounceKeyword}`;
        } else {
            host = `${backendhost}/api/pegawai/view?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}`;
        }

        const res = await fetch(host, {
            method: 'GET',
            headers: await headers(),
        });

        if(res.status !== 200){
            return
        }

        const resData = await res.json();
        const [from, to] = useFromTo(urlQuery.page, urlQuery.pageSize, resData.totalItem);
        const newDataData = [...resData.data];
        const newMetaData = {
            counts: resData.totalItem,
            page: urlQuery.page,
            limit: urlQuery.pageSize,
            from: from,
            to: to
        };

        const newData = { ...dataInitial, metadata: newMetaData, data: [...newDataData] };
        setData(newData);
    }

    const paginationHandler = (val, e) => {
        e.preventDefault();
        setUrlQuery({ ...urlQuery, page: val });
    }

    const pageSizeHandler = (val) => {
        setUrlQuery({ ...urlQuery, pageSize: val, page: 1 });
    }
    
    const searchHandler = (val) => {
        setUrlQuery({...urlQuery, keyword: val, page: 1});
        getData();
    }

    useEffect(() => {
        getData();
    } ,[debounceKeyword, urlQuery.page, urlQuery.pageSize]);

    const deleteHandler = async (post) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin menghapus data Pegawai ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/pegawai/delete-pegawai/${post.id}`, {
                method: 'DELETE',
                headers: await headers()
            });
            
            if(!res.ok){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.statusText
                });

                return;
            }

            const dataApiNew = await res.json();
            const filteredPost = data.data.filter((p) => p.id !== post.id);
            const newData = {
                ...data,
                data: filteredPost
            };
            setData(newData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: dataApiNew.message
            });
        }
    }

    const editHandler = (val) => {
        router.push(`/pegawai/update-pegawai?id=${val.id}`);
    }

    const createAkun = (e,val) => {
        e.preventDefault();
        setId(val.id);
        setShowAddAkunDialog(true);
    }

    

    const opsi = (val) => {
        return (
            <td>
                <div className="flex justify-center">
                    <div className="">
                        <span className="edit px-1 cursor-pointer text-blue-950 hover:text-flame" onClick={() => editHandler(val)}><i className="bi bi-pencil-square"></i></span>
                        <Tooltip anchorSelect=".edit" place="top">Edit</Tooltip>
                    </div>
                    <div className="">
                        <p className="hapus px-1 cursor-pointer text-orang-950 hover:text-flame" onClick={(e) => deleteHandler(val)}><i className="bi bi-trash"></i></p>
                        <Tooltip anchorSelect=".hapus" place="top">Hapus</Tooltip>
                    </div>
                    <div className="">
                        <p className="akun px-1 cursor-pointer text-red-950 hover:text-flame" onClick={(e) => createAkun(e,val)}><i className="bi bi-lock"></i></p>
                        <Tooltip anchorSelect=".akun" place="top">Akun</Tooltip>
                    </div>
                </div>
            </td>
        );
    }

    return (
        <>
            <Dialog
                header='Create Akun'
                visible={showAddAkunDialog}
                style={{ width: 'auto' }}
                onHide={() => setShowAddAkunDialog(false)}
            >
                <FormAkun idPegawai={id} setShow={setShowAddAkunDialog} method="POST" />
            </Dialog>
            <Breadcrumb
                data={[
                    {
                        title: 'Data Master',
                    },
                    {
                        title: 'Data Pegawai',
                        href: '/pegawai'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Pegawai"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <Link href="/pegawai/new" className="lg:ml-2 btn-primary" onClick={() => setSubmitting(true)}>Add Pegawai {submitting && (<LoaderSpin />)}</Link>
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            pageSizeHandler={pageSizeHandler}
                            paginationHandler={paginationHandler}
                            searchHandler={searchHandler}
                            action={opsi}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default PegawaiPage;
