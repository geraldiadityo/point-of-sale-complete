"use client";
import Breadcrumb from "@/components/Breadcrumb";
import Table from "@/components/Table";
import TitleText from "@/components/TitleText";
import LoaderSpin from "@/components/LoaderSpin";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import useDebounce from "@/hooks/useDebounce";
import { useFromTo } from "@/utils/function";

const PenggunaPage = () => {
    const dataInitial = {
        columns: [
            { key: 'username', lable: 'username' },
            { key: 'pegawai', lable: 'Pegawai' },
            { key: 'role', lable: 'Role' },
            { key: 'status', lable: 'Status' }
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
    
    const [data, setData] = useState();
    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        keyword: ''
    });
    const debounceKeyword = useDebounce(urlQuery.keyword, 500);

    const getData = async () => {
        let host = '';
        if (debounceKeyword !== ''){
            host = `${backendhost}/api/pengguna/search?keyword=${debounceKeyword}`;
        } else {
            host = `${backendhost}/api/pengguna/view?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}`;
        }

        const res = await fetch(host, {
            method: 'GET',
            headers: await headers()
        });

        if(res.status != 200){
            return;
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
        setUrlQuery({...urlQuery, page: val});
    }

    const pageSizeHandler = (val) => {
        setUrlQuery({...urlQuery, page: 1, pageSize: val});
    }

    const searchHandler = (val) => {
        setUrlQuery({...urlQuery, keyword: val, page: 1});
        getData()
    };

    useEffect(() => {
        getData();
    }, [debounceKeyword, urlQuery.page, urlQuery.pageSize]);

    const filterFunc = (val, column, post) => {
        if(column == 'pegawai'){
            return (
                <>
                    <p>{val.nama_lengkap}</p>
                    <p className="text-gray-400">No Karyawan: {val.nk}</p>
                    <p className="text-gray-400">Nik: {val.nik}</p>
                </>
            )
        } else if (column == 'role'){
            return val.nama_role
        } else if (column == 'status'){
            return val ? (
                <>
                    <span className="px-2 py-1 rounded-sm text-green bg-green-200">Active</span>
                </>
            ) : (
                <>
                    <span className="px-2 py-1 rounded-sm text-red bg-red-200">Non-Active</span>
                </>
            )
        }

        return val;
    };
    
    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data',
                    },
                    {
                        title: 'Pengguna Data',
                        href: '/pengguna'
                    },
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Pengguna"
                        />
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
                        />
                    )}
                </div>
            </section>

        </>
    )
}

export default PenggunaPage;
