"use client";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { tanggalDisplay, useFromTo } from "@/utils/function";
import { Tooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";
import TitleText from "../TitleText";
import useDebounce from "@/hooks/useDebounce";
import Table from "../Table";
import { SelectButton } from 'primereact/selectbutton';
const StokPage = () => {
    const dataInitial = {
        columns: [
            { key: 'batch', lable: 'Batch' },
            { key: 'type', lable: 'Type' },
            { key: 'qty', lable: 'Quantity' },
            { key: 'keterangan', lable: 'Keterangan' },
            { key: 'tanggal', lable: 'Tanggal' },
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

    // data
    const [dataApi, setDataApi] = useState();
    const options = ['IN', 'OUT'];
    const [data, setData] = useState(dataInitial);
    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        type: 'IN'
    });

    const getData = async () => {
        const host = `${backendhost}/api/stok/view?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}&type=${urlQuery.type}`;

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

    const paginationHandler = (val, e) => {
        e.preventDefault();
        setUrlQuery({...urlQuery, page: val});
    }
    
    const pageSizeHandler = (val) => {
        setUrlQuery({ ...urlQuery, page:1, pageSize: val });
    };

    // type change


    // end type change

    
    useEffect(() => {
        getData();
    }, [urlQuery.page, urlQuery.pageSize, urlQuery.type]);

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
        })
    }, [dataApi]);

    

    const filterFunc = (val, column, post) => {
        if(column === 'batch'){
            return (
                <p>{val.nomor} - {val.barang.nama_barang}</p>
            )
        } else if (column === 'tanggal'){
            return tanggalDisplay(val)
        }

        return val;
    }

    
    return (
        <>
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Stok"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <SelectButton
                            value={urlQuery.type}
                            options={options}
                            onChange={(e) => setUrlQuery({...urlQuery, type: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            nomor={true}
                            filterFunc={filterFunc}
                            pageSizeHandler={pageSizeHandler}
                            paginationHandler={paginationHandler}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default StokPage;
