"use client";

import { useState, useEffect } from "react";
import {  backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { useFromTo } from "@/utils/function";
import { Tooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import BarangForm from "@/components/barang/barang/BarangForm";
import TableBatch from "@/components/barang/batch/TableBatch";
import useDebounce from "@/hooks/useDebounce";
import Table from "@/components/Table";

const BarangPage = () => {
    const dataInitial = {
        columns: [
            { key: 'kode_barang', lable: 'Kode Barang' },
            { key: 'nama_barang', lable: 'Nama Barang' },
            { key: 'satuan', lable: 'Satuan' },
            { key: 'kategori', lable: 'Kategori' }
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

    const [showForm, setShowForm] = useState(false);
    const [showBatch, setShowBatch] = useState(false);
    
    const [dataApi, setDataApi] = useState();
    const [data, setData] = useState(dataInitial);
    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        keyword: ''
    });
    const debounceKeyword = useDebounce(urlQuery.keyword, 500);

    const [post, setPost] = useState({
        kode_barang: '',
        nama_barang: '',
        satuanId: '',
        kategoriId: ''
    });
    const [method, setMethod] = useState("");
    const [title, setTitle] = useState("");

    const getData = async () => {
        let host = '';
        if(debounceKeyword !== ''){
            host = `${backendhost}/api/barang/search-barang?keyword=${debounceKeyword}`;
        } else {
            host = `${backendhost}/api/barang/view?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}`;
        }

        const res = await fetch(host, {
            method: 'GET',
            headers: await headers()
        });

        if(res.status !== 200){
            return;
        }

        const resData = await res.json()
        setDataApi(resData);
    }

    const paginationHandler = (val, e) => {
        e.preventDefault();
        setUrlQuery({...urlQuery, page: val});
    }

    const pageSizeHandler = (val) => {
        setUrlQuery({...urlQuery, pageSize: val, page: 1});
    }

    const searchHandler = (val) => {
        setUrlQuery({ ...urlQuery, keyword: val, page: 1 });
        getData()
    };

    useEffect(() => {
        getData();
    }, [debounceKeyword, urlQuery.page, urlQuery.pageSize]);

    useEffect(() => {
        if(!dataApi) return;
        const [from, to] = useFromTo(urlQuery.page, urlQuery.pageSize, dataApi.totalItem);
        setData({
            ...data,
            metadata: {
                counts: dataApi.totalItem,
                page: urlQuery.page,
                limit: urlQuery.pageSize,
                from: from,
                to: to
            },
            data: [...dataApi.data]
        });
    }, [dataApi]);

    const deleteHandler = async (val) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin menghapus data barang ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
        
        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/barang/delete-barang/${val.id}`, {
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
            const filterdPost = data.data.filter((p) => p.id !== val.id);
            setData({...data, data: [...filterdPost]});
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    };

    const createHandler = () => {
        setMethod("POST");
        setTitle("Add");
        setShowForm(true);
    };

    const editHandler = (e, val) => {
        e.preventDefault();
        setMethod("PUT");
        setTitle("Update");
        setPost({
            id: val.id,
            kode_barang: val.kode_barang,
            nama_barang: val.nama_barang,
            satuanId: val.satuan.id,
            kategoriId: val.kategori.id
        });
        setShowForm(true);
    };
    
    const batchHandler = (e, val) => {
        e.preventDefault();
        setPost({
            id: val.id,
            kode_barang: val.kode_barang,
            nama_barang: val.nama_barang,
            satuanId: val.satuan.id,
            kategoriId: val.kategori.id
        });
        setShowBatch(true);
    };
    
    const opsi = (val) => {
        return (
            <td>
                <div className="flex justify-center">
                    <div className="">
                        <span className="batch px-1 cursor-pointer text-red-950 hover:text-flame" onClick={(e) => batchHandler(e,val)}><i className="bi bi-eye"></i></span>
                        <Tooltip anchorSelect=".batch" place="top">Batch</Tooltip>
                    </div>
                    <div className="">
                        <span className="edit px-1 cursor-pointer text-blue-950 hover:text-flame" onClick={(e) => editHandler(e,val)}><i className="bi bi-pencil-square"></i></span>
                        <Tooltip anchorSelect=".edit" place="top">Edit</Tooltip>
                    </div>
                    <div className="">
                        <p className="hapus px-1 cursor-pointer text-orang-950 hover:text-flame" onClick={(e) => deleteHandler(val)}><i className="bi bi-trash"></i></p>
                        <Tooltip anchorSelect=".hapus" place="top">Hapus</Tooltip>
                    </div>
                </div>
            </td>
        );
    }

    const filterFunc = (val, column, pos) => {
        if(column == 'satuan'){
            return(
                val.nama_satuan
            )
        } else if (column === 'kategori'){
            return (
                val.nama_kategori
            )
        }

        return val
    }

    return (
        <>
            <Dialog
                header={`${title} Barang`}
                visible={showForm}
                style={{ width: 'auto' }}
                onHide={() => setShowForm(false)}
            >
                <BarangForm
                    title={title}
                    method={method}
                    post={post}
                    triggerShow={setShowForm}
                    getData={getData}
                />
            </Dialog>
            <Dialog
                header={'Batch Barang'}
                visible={showBatch}
                style={{ width: 'auto' }}
                onHide={() => setShowBatch(false)}
            >
                <TableBatch
                    post={post}
                />
            </Dialog>
            <div className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Barang"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <p className="lg:ml-2 cursor-pointer btn-primary" onClick={() => { createHandler() }}>Add Barang</p>
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            nomor={true}
                            paginationHandler={paginationHandler}
                            pageSizeHandler={pageSizeHandler}
                            searchHandler={searchHandler}
                            filterFunc={filterFunc}
                            action={opsi}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default BarangPage;
