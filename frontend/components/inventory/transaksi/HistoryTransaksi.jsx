import Table from "@/components/Table";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { useFromTo } from "@/utils/function";
import { Dialog } from "primereact/dialog";
import { tanggalDisplay, uangDisplay } from "@/utils/function";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { terbilang } from "@/utils/function";
import useDebounce from "@/hooks/useDebounce";
import TableDetailTransaksi from "./DetailTransaksi";

const HistoryRekanan = () => {
    const [batalTransaksiSignal, setBatalTransaksiSignal] = useState([]);
    const router = useRouter();
    
    // tab menu
    const items = [
        { label: 'Data Non Final', icon: "bi bi-card-list" },
        { label: "Data Final", icon: "bi bi-card-checklist" },
    ];

    const dataInit = {
        columns: [
            { key: 'id', lable: 'Id' },
            { key: 'nomor_faktur', lable: 'No Faktur' },
            { key: 'tanggal_faktur', lable: 'Tanggal Faktur' },
            { key: 'supplier', lable: 'Nama Rekanan' },
            { key: 'status_bayar', lable: 'Status Bayar' },
        ],
        metadata: {},
        data: []
    };

    const dataKeranjangTemp = {
        columns: [
            { key: 'id', lable: 'Id' },
            { key: 'nomor_batch', lable: 'Nomor Batch' },
            { key: 'barang', lable: 'Nama Barang' },
            { key: 'qty', lable: 'Qty' },
            { key: 'expired_date', lable: 'Expired Date' },
            { key: 'harga_beli', lable: 'Harga Beli' },
            { key: 'harga_jual', lable: 'Harga Jual' },
            { key: 'total_harga', lable: 'Sub Total' }
        ],
        data: []
    };

    const dataDetailTransaksiTemp = {
        columns: [
            { key: 'id', lable: 'Id' },
            { key: 'batch', lable: 'Nomor Batch' },
            { key: 'barang', lable: 'Nama Barang' },
            { key: 'qty', lable: 'Qty' },
            { key: 'expirate_date', lable: 'Expired Date' },
            { key: 'harga_beli', lable: 'Harga Beli' },
            { key: 'harga_jual', lable: 'Harga Jual' },
            { key: 'total_harga', lable: 'Sub Total' }
        ],
        data: []
    }

    const [dataRaw, setDataRaw] = useState(dataInit);
    const [finalTab, setFinalTab] = useState(0);
    const [data, setData] = useState();
    const [dataDetailTransaksi, setDataDetailTransaksi] = useState();
    const [dataDetailTable, setDataDetailTable] = useState();
    const [dataKeranjang, seteDataKeranjang] = useState();
    const [totalDetailData, setTotalDetailData] = useState(0);

    const [showDetailTransaksi, setShowDetailTransaksi] = useState(false);

    const [urlQuery, setUrlQuery] = useState({
        page: 1,
        pageSize: 25,
        status:"final",
        keyword: ""
    });

    const [urlQueryStatusBayar, setUrlQueryStatusBayar] = useState({
        status: "lunas"
    });

    // pencarian
    const [querySearch, setQuerySearch] = useState({
        keyword: ""
    });

    const debounceKeyword = useDebounce(querySearch.keyword, 500);

    const getPencarianHistories = async () => {
        try{
            const res = await fetch(`${backendhost}/api/transaksi/search-transaksi?keyword=${debounceKeyword}&page=${urlQuery.page}&pageSize=${urlQuery.pageSize}`, {
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();
            const [from, to] = useFromTo(resData.currentPage, urlQuery.pageSize, resData.totalItem);
            setData({
                ...dataInit,
                metadata: {
                    counts: resData.totalItem,
                    page: resData.currentPage,
                    limit: urlQuery.pageSize,
                    from: from,
                    to: to
                },
                data: resData.data
            })
        } catch (err){
            console.log(err);
        }
    };

    useEffect(() => {
        getPencarianHistories()
    }, [debounceKeyword]);

    useEffect(() => {
        const getHistoryDataApi = async () => {
            let host = `${backendhost}/api/transaksi/list-by-final?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}&status=${urlQuery.status}`;

            if(finalTab > 1){
                host = `${backendhost}/api/transaksi/list-by-status?page=${urlQuery.page}&pageSize=${urlQuery.pageSize}&status=${urlQueryStatusBayar.status}`;
            }

            const res = await fetch(host,{
                method: 'GET',
                headers: await headers()
            });

            if(res.status !== 200){
                return;
            }

            const resData = await res.json();
            const [from ,to] = useFromTo(resData.currentPage, urlQuery.pageSize, resData.totalItem);
            const newDataData = resData.data;
            const newMetaData = {
                counts: resData.totalItem,
                page: resData.currentPage,
                limit: urlQuery.pageSize,
                from: from,
                to: to
            };

            const newData = {
                ...dataRaw,
                metadata: newMetaData,
                data: [...newDataData],
            };

            setData(newData)
        }

        getHistoryDataApi();
    }, [urlQuery, batalTransaksiSignal, urlQueryStatusBayar, finalTab]);

    const filterFunc = (val, column, p) => {
        if(column === 'tanggal_faktur'){
            return tanggalDisplay(val);
        } else if (column === 'nomor_faktur'){
            return (
                <>
                    <span className="hover:text-flame hover:underline cursor-pointer underline">{val}</span>
                </>
            );
        } else if (column === 'supplier'){
            return val.nama_supplier;
        } else if (column === 'status_bayar'){
            if(!val){
                return (
                    <>
                        <span className="px-2 py-1 rounded-sm bg-orange-200 text-flame">
                            Belum Lunas
                        </span>
                    </>
                )
            }

            return (
                <>
                    <span className="px-2 py-1 rounded-sm bg-green-200 text-green-700">
                        Lunas
                    </span>
                </>
            )
        }

        return val;
    };

    const optionHistory = {
        show_page_limit_dropdown: true,
        show_search_input: true
    };

    const finalOrNoHandler = (e, i) => {
        e.preventDefault();
        setFinalTab(i);

        if (i === 0){
            setUrlQuery({ ...urlQuery, status: 'final' });
        } else if(i === 1){
            setUrlQuery({ ...urlQuery, status: 'Belum' });
        } else if(i === 2){
            setUrlQueryStatusBayar({ ...urlQueryStatusBayar, status: 'Lunas' });
        } else {
            setUrlQueryStatusBayar({ ...urlQueryStatusBayar, status: 'Belum' });
        }
    };

    const finalHandler = async (post) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin Menfinalkan Transaksi Ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Final it!',
            cancelButtonText: 'No, cancel!',
        });

        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/transaksi/final-transaksi/${post.id}`, {
                method: 'PATCH',
                headers: await headers()
            });

            if(res.status !== 200){
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: 'Kesalahan dari server'
                });
                return;
            }

            const resData = await res.json();
            const filterPost = data.data.filter((p) => p.id !== post.id);
            const newData = { ...data, data: filterPost };
            setData(newData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    };

    const lunaskanHandler = async (e, val) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin Melunaskan Transaksi ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, cancel!',
        });

        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/transaksi/change-status-bayar/${val.id}`, {
                method: 'PATCH',
                headers: await headers()
            });

            if(res.status !== 200){
                Swal.fire({
                    icon: 'error',
                    title: res.statusText,
                    text: 'Error From Server'
                });
                return;
            }

            const resData = await res.json();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    }

    const nomorFakturFinalHandler = (val) => {
        const getDetailRekanan = async (val) => {
            const res = await fetch(`${backendhost}/api/transaksi/get-detail-by-nomor/${val.nomor_faktur}`, {
                method: 'GET',
                headers: await headers(),
            });

            if(!res.ok){
                return;
            }

            const data = await res.json();
            const newData = {...dataDetailTransaksiTemp, data: data.data.detail};

            let total = 0;
            data.data.detail.map((item) => {
                total += item.qty * item.harga_beli;
            });

            setTotalDetailData(total);
            setDataDetailTransaksi(data);
            setDataDetailTable(newData);
            setShowDetailTransaksi(true);
        }

        getDetailRekanan(val);
    };

    const keranjangViewHandler = (val) => {
        const getDetailRekanan = async (val) => {
            const res = await fetch(`${backendhost}/api/transaksi/get-keranjang-by-nomor/${val.nomor_faktur}`, {
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const data = await res.json();
            const newData =  {...dataKeranjangTemp, data: data.data.keranjang};
            
            let total = 0;
            data.data.keranjang.map((item) => {
                total += item.qty * item.harga_beli
            });

            setTotalDetailData(total);
            setDataDetailTransaksi(data);
            setDataDetailTable(newData);
            setShowDetailTransaksi(true);
        }

        getDetailRekanan(val);
    };

    const filterDataDetailFunc = (val, column, post) => {
        if (column === "barang"){
            return val.nama_barang;
        } else if(column === 'total_harga') {
            return (
                <p className="text-right">{uangDisplay(post.harga_beli * post.qty)}</p>
            );
        } else if (column === 'qty' || column === 'harga_jual' || column === 'harga_beli'){
            return (
                <p className="text-right">{uangDisplay(val)}</p>
            );
        } else if (column === 'batch'){
            return val.nomor;
        } else if (column === 'expirate_date'){
            return tanggalDisplay(val);
        } else if (column === 'expired_date'){
            return tanggalDisplay(val);
        }

        return val;
    }

    const options = {
        show_page_limit_dropdown: false,
        show_search_input: false
    }

    const opsi = (val) => {
        if(finalTab === 0){
            return (
                <td>
                    {!val.status_bayar && (

                        <span className="text-white bg-vivid-cerulean mx-1 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-vivid-cerulean/50" onClick={(e) => {lunaskanHandler(e,val)}}>Bayar</span>
                    )}
                    <span> </span>
                    <span className="text-white bg-green-500 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-green-900" onClick={() => {nomorFakturFinalHandler(val)}}>Detail</span>
                    <span> </span>
                    <span className="text-white bg-red-500 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-red-900" onClick={(e) => {batalTransaksi(val)}}>Batal Transaksi</span>

                </td>
            );
        } else if(finalTab === 1){
            return (
                <td>
                    <span className="text-white bg-vivid-cerulean px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-vivid-cerulean/50" onClick={(e) => {finalHandler(val)}}>
                        Final
                    </span>
                    <span> </span>
                    <span className="text-white bg-blue-500 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-blue-900" onClick={() => {keranjangViewHandler(val)}}>Keranjang</span>
                </td>
            );
        } else if(finalTab === 2){
            return (
                <td>

                </td>
            );
        } else {
            return (
                <td>
                    <span className="text-white bg-vivid-cerulean mx-1 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-vivid-cerulean/50" onClick={(e) => {lunaskanHandler(val)}}>Bayar</span>
                </td>
            )
        }
    }

    const paginationHandler = (val, e) => {
        e.preventDefault();
        setUrlQuery({...urlQuery, page: val});
    }

    const pageSizeHandler = (val) => {
        setUrlQuery({...urlQuery, pageSize: val});
    }

    const batalTransaksi = async (post) => {
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
            const res = await fetch(`${backendhost}/api/transaksi/cancel-transaksi/${post.id}`, {
                method: 'DELETE',
                headers: await headers()
            });

            if(res.status !== 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'internal server error'
                })

                return;
            }

            const resData = await res.json();

            setBatalTransaksiSignal([...batalTransaksiSignal]);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message
            });
        }
    }

    return (
        <>
            <Dialog
                header={"Nomor Faktur "+ dataDetailTransaksi?.data.transaksi.nomor_faktur}
                visible={showDetailTransaksi}
                style={{ width: 'auto' }}
                onHide={() => setShowDetailTransaksi(false)}
            >
                <TableDetailTransaksi
                    rekanan={dataDetailTransaksi}
                    details={dataDetailTable}
                    filter={filterDataDetailFunc}
                    options={options}
                    total={totalDetailData}
                />
            </Dialog>
            <div className="card">
                <div className="mt-5">
                    <ul className="-mx-1">
                        <li className="inline-block text-sm font-medium mx-1">
                            <a
                                className={`px-4 py-2 border border-b-transparent rounded-t-2xl text-gunmetal ${finalTab === 0 ? "bg-white" : "bg-gray-300"}`}
                                onClick={(e) => finalOrNoHandler(e, 0)}
                                href="#"
                            >
                                <i className="bi bi-check-all"></i> Data Final
                            </a>
                        </li>
                        <li className="inline-block text-sm font-medium mx-1">
                            <a
                                className={`px-4 py-2 border border-b-transparent rounded-t-2xl text-gunmetal ${finalTab === 1 ? "bg-white" : "bg-gray-300"}`}
                                onClick={(e) => finalOrNoHandler(e, 1)}
                                href="#"
                            >
                                <i className="bi bi-card-list"></i> Data Non Final
                            </a>
                        </li>
                        <li className="inline-block text-sm font-medium mx-1">
                            <a
                                className={`px-4 py-2 border border-b-transparent rounded-t-2xl text-gunmetal ${finalTab === 2 ? "bg-white" : "bg-gray-300"}`}
                                onClick={(e) => finalOrNoHandler(e, 2)}
                                href="#"
                            >
                                <i className="bi bi-card-list"></i> Data Lunas
                            </a>
                        </li>
                        <li className="inline-block text-sm font-medium mx-1">
                            <a
                                className={`px-4 py-2 border border-b-transparent rounded-t-2xl text-gunmetal ${finalTab === 3 ? "bg-white" : "bg-gray-300"}`}
                                onClick={(e) => finalOrNoHandler(e, 3)}
                                href="#"
                            >
                                <i className="bi bi-card-list"></i> Data Belum Lunas
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mt-3">
                {data && (
                    <Table
                        data={data}
                        filterFunc={filterFunc}
                        nomor={true}
                        action={opsi}
                        options={optionHistory}
                        paginationHandler={paginationHandler}
                        pageSizeHandler={pageSizeHandler}
                    />
                )}
            </div>
        </>
    )

}

export const activator = () => {
    return (
        <div className="card">
            <div className="mt-5">
                <ul className="-mx-1">
                    <li className="inline-block text-sm font-medium mx-1">
                        <a
                            className="px-4 bg-gray-300 py-2 border border-b-transparent rounded-t-2xl text-gunmetal"
                            href=""
                        >
                            Data Non Final
                        </a>
                    </li>
                    <li className="inline-block text-sm font-medium mx-1">
                        <a
                            className="px-4 bg-gray-300 py-2 border border-b-transparent rounded-t-2xl text-gunmetal"
                            href=""
                        >
                            Data Final
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default HistoryRekanan;
