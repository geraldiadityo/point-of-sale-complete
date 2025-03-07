"use client";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { useFromTo } from "@/utils/function";
import { Tooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import SupplierForm from "@/components/supplier/SupplierForm";
import useDebounce from "@/hooks/useDebounce";
import Table from "@/components/Table";
import Swal from "sweetalert2";

const SupplierPage = () => {
    const dataInitial = {
        columns: [
            { key: 'nama_supplier', lable: 'Nama Supplier' },
            { key: 'nomor_telp', lable: 'Nomor Telp' },
            { key: 'alamat', lable: 'Alamat' },
            { key: 'deskripsi', lable: 'Deskripsi' },
        ],
        metadata: {
            counts: 0,
            page: 1,
            limit: 25,
            from: 0,
            to: 0
        },
        data: [],
    };
    
    const [showForm, setShowForm] = useState(false);
    const [data, setData] = useState(dataInitial);
    const [dataApi, setDataApi] = useState();
    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        keyword: ''
    });
    const keywordDebounce = useDebounce(urlQuery.keyword, 500);

    const [post, setPost] = useState({
        nama_supplier: '',
        nomor_telp: '',
        alamat: '',
        deskripsi: ''
    });
    const [title, setTitle] = useState("");
    const [method, setMethod] = useState("");
    
    const paginationHandler = (val, e) => {
        e.preventDefault();
        setUrlQuery({...urlQuery, page: val});
    };

    const pageSizeHandler = (val) => {
        setUrlQuery({...urlQuery, pageSize: val, page: 1});
    };

    const searchHandler = (val) => {
        setUrlQuery({...urlQuery, keyword: val});
        getData();
    };

    const getData = async () => {
        let host = '';
        if(keywordDebounce !== ''){
            host = `${backendhost}/api/supplier/search-supplier?keyword=${keywordDebounce}`;
        } else {
            host = `${backendhost}/api/supplier/view?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}`;
        }

        const res = await fetch(host, {
            method: 'GET',
            headers: await headers()
        });

        if(res.status !== 200){
            return;
        }

        const resData = await res.json();
        setDataApi(resData);
    };

    useEffect(() => {
        getData()
    },[keywordDebounce, urlQuery.page, urlQuery.pageSize]);

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
            data:[...dataApi.data]
        });
    }, [dataApi]);

    const deleteHandler = async (val) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin menghapus data supplier ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/supplier/delete-supplier/${val.id}`,{
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
            const filteredPost = data.data.filter((p) => p.id !== val.id);
            setData({...data, data: [...filteredPost]});
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    };

    const createHandler = () => {
        setTitle("Add");
        setMethod("POST");
        setPost({
            nama_supplier: '',
            nomor_telp: '',
            alamat: '',
            deskripsi: ''
        });
        setShowForm(true);
    };

    const editHandler = (e,val) => {
        e.preventDefault();
        setTitle("Update");
        setMethod("PUT");
        setPost({
            id: val.id,
            nama_supplier: val.nama_supplier,
            nomor_telp: val.nomor_telp,
            alamat: val.alamat,
            deskripsi: val.deskripsi
        });
        setShowForm(true);
    }

    const opsi = (val) => {
        return (
            <td>
                <div className="flex justify-center">
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

    return (
        <>
            <Dialog
                header={`${title} Supplier`}
                visible={showForm}
                style={{ width: 'auto' }}
                onHide={() => setShowForm(false)}
            >
                <SupplierForm
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
                        title: 'Data Supplier',
                        href: '/supplier'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Supplier"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <p className="lg:ml-2 btn-primary cursor-pointer" onClick={() => {createHandler()}}>Add</p>
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            paginationHandler={paginationHandler}
                            pageSizeHandler={pageSizeHandler}
                            nomor={true}
                            searchHandler={searchHandler}
                            action={opsi}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default SupplierPage;
