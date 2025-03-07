import { useState, useEffect, useRef } from "react";
import Table from "@/components/Table";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from 'primereact/calendar';
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";
import { KategoriBarang, SatuanBarang, NamaSuppier, NamaBarang } from "@/components/references";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import { tanggalDisplay, uangDisplay } from "@/utils/function";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    timer: 3000,
    timerProgressBar: true,
});

const NewTransaksi = ({ setActiveIndex }) => {
    const [toggleDialogBarang, setToggleDialogBarang] = useState(false);
    
    // transaksi
    const [postTransaksi, setPostTransaksi] = useState({
        nomor_faktur: '',
        tanggal_faktur: '',
        tanggal_terima: '',
        tanggal_jatuh_tempo: '',
        supplierId: -1,
        keterangan: '',
        detail_transaksi: []
    });

    const [postTransaksiDetailTransaksi, setPostTransaksiDetailTransaksi] = useState({
        barang: null,
        barangId: 0,
        nomor_batch: '',
        qty: 0,
        harga_jual: 0,
        harga_beli: 0,
        expirate_date: '',
        tanggal: '',
        subtotal: 0,
    });

    const [signalSimpanTransaksi, setSignalSimpanTransaki] = useState([]);

    // supplier
    const [postSupplier, setPostSupplier] = useState({
        nama_supplier: '',
        nomor_telp: '',
        alamat: '',
        deskripsi: ''
    });

    const [isSupplierBaru, setIsSupplierBaru] = useState(true);

    const setPostSupplierTrigger = (val) => {
        setPostSupplier({...postSupplier, nama_supplier: val});
        if (isSupplierBaru){
            setPostTransaksi({...postTransaksi, supplierId: val?.id});
        }
    }

    // end supplier

    // detail_barang
    const [addBarangSignal, setAddBarangSignal] = useState([]);
    const [isBarangBaru, setIsBarangBaru] = useState(true);
    const [postBarang, setPostBarang] = useState({
        kode_barang: '',
        nama_barang: '',
        satuan: '',
        kategrori: '',
    });

    const addBarangHandler = async (e) => {
        e.preventDefault();
        
        if(!isBarangBaru){
            const baranBaru = {
                kode_barang: postBarang?.kode_barang,
                nama_barang: postBarang?.nama_barang,
                satuanId: parseInt(postBarang?.satuan.id),
                kategoriId: parseInt(postBarang?.kategrori.id)
            };
            const res = await fetch(`${backendhost}/api/barang/create-barang`, {
                method: 'POST',
                headers: await headers(),
                body: JSON.stringify(baranBaru)
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();

            setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, barangId: resData.data.id, barang: resData.data});

            Toast.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message,
                timer: 3000
            });
        }

        setAddBarangSignal([...addBarangSignal]);
        setToggleDialogBarang(false);
    }

    const [total, setTotal] = useState(0);

    const itemsBarangTables = ({
        columns: [
            { key: 'barangId', lable: 'Id' },
            { key: 'barang', lable: 'Barang' },
            { key: 'nomor_batch', lable: 'Batch' },
            { key: 'qty', lable: 'Jumlah' },
            { key: 'harga_beli', lable: 'Harga Beli' },
            { key: 'harga_jual', lable: 'Harga Jual' },
            { key: 'expirate_date', lable: 'Exp Date' },
            { key: 'subtotal', lable: 'Sub Total' },
        ],
        data: [],
        metadata: {}
    });

    const [dataTable, setDataTable] = useState(itemsBarangTables);

    useEffect(() => {
        if(!postTransaksiDetailTransaksi.barang){
            return;
        }

        const postTransaksiDetailTransaksiConvert = {
            barang: postTransaksiDetailTransaksi.barang,
            barangId: parseInt(postTransaksiDetailTransaksi.barangId),
            nomor_batch: postTransaksiDetailTransaksi.nomor_batch,
            qty: parseInt(postTransaksiDetailTransaksi.qty),
            harga_jual: parseInt(postTransaksiDetailTransaksi.harga_jual),
            harga_beli: parseInt(postTransaksiDetailTransaksi.harga_beli),
            expirate_date: postTransaksiDetailTransaksi.expirate_date
        };

        setDataTable({...dataTable, data: [...dataTable.data, postTransaksiDetailTransaksiConvert]});
    }, [addBarangSignal]);

    const setPostBarangTrigger = (val) => {
        setPostBarang({...postBarang, nama_barang: val});

        if(isBarangBaru){
            setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, barangId: val.id, barang: val});
        }
    };

    const setPostSatuanBarangTrigger = (val) => {
        setPostBarang({...postBarang, satuan: val});
    };

    const setPostKategoriBarangTrigger = (val) => {
        setPostBarang({...postBarang, kategrori: val});
    };

    const showDialogBarang = () => {
        setPostBarang({
            kode_barang: '',
            nama_barang: '',
            satuan: '',
            kategrori: '',
        });

        setPostTransaksiDetailTransaksi({
            barang: null,
            barangId: "",
            nomor_batch: "",
            qty: "",
            harga_jual: "",
            harga_beli: "",
            expirate_date: "",
            tanggal: "",
        });

        setToggleDialogBarang(true);
    };

    // simpan transaksi
    const simpanTransaksi = async (e) => {
        e.preventDefault();

        let postTransakiCopy = {...postTransaksi};

        // simpan supplier baru
        if(!isSupplierBaru){
            const res = await fetch(`${backendhost}/api/supplier/create-supplier`, {
                method: 'POST',
                headers: await headers(),
                body: JSON.stringify(postSupplier)
            });

            if(!res.ok){
                return;
            }
            
            const resData = await res.json();

            postTransakiCopy = {...postTransakiCopy, rekanan: resData.data.id};

            Toast.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message,
                timer: 2000
            });
        }

        setPostTransaksi({...postTransakiCopy, detail_transaksi: [...dataTable.data]});

        setSignalSimpanTransaki([...signalSimpanTransaksi]);
    }

    useEffect(() => {
        const doPostTransaksi = async () => {
            const { detail_transaksi, ...transaksi } = postTransaksi;
            const requestAllTransc = {
                transaksi: transaksi,
                detail_transaksi: detail_transaksi
            };
            
            const res = await fetch(`${backendhost}/api/transaksi/create-transaksi`, {
                method: 'POST',
                headers: await headers(),
                body: JSON.stringify(requestAllTransc)
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();

            Toast.fire({
                icon: 'success',
                title: 'Success',
                text: resData.message,
                timer: 3000,
            });
            
            console.log(JSON.stringify(requestAllTransc))

            setTimeout(() => {
                setActiveIndex(0);
            }, 1000);
        }

        if(postTransaksi.detail_transaksi.length <= 0 || postSupplier.nama_supplier === ''){
            console.log('failed transaksi');
            return;
        }

        doPostTransaksi();
    }, [signalSimpanTransaksi]);

    const filterFunc = (val, column, post) => {
        if(column === 'barang'){
            return val?.nama_barang ?? val;
        } else if (column === 'expirate_date'){
            return (
                <>
                    <p className="">Exp. Date: {tanggalDisplay(val)}</p>
                </>
            );
        } else if (column === 'harga_jual' || column === 'harga_beli'){
            return (
                <>
                    <p className="text-end">{uangDisplay(val)}</p>
                </>
            );
        } else if (column === 'subtotal'){
            return (
                <>
                    <p className="text-end">{uangDisplay(post.harga_beli * post.qty)}</p>
                </>
            );
        } else if (column === 'qty'){
            return (
                <>
                    <p className="text-end">{val}</p>
                </>
            );
        }

        return val;
    }

    const opsi = (val) => {
        return (
            <td>
                <span className="cursor-pointer hover:text-flame" onClick={() => deleteDataTableHandler(val)}>
                    <i className="bi bi-trash"></i>
                </span>
            </td>
        );
    }

    const deleteDataTableHandler = async (val) => {
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
            const filteredData = dataTable.data.filter(item => item.barangId !== val.barangId);
            setDataTable({...dataTable, data: [...filteredData]});
        }
    }

    useEffect(() => {
        let newTotal = 0;
        dataTable.data.map((item) => {
            newTotal += item.qty * item.harga_beli;
        });

        setTotal(newTotal);
    }, [dataTable]);

    return (
        <>
            <form id="form_transaksi" onSubmit={simpanTransaksi}>
                <div className="">
                    <div className="flex flex-col">
                        <p className="text-sm">Nama Supplier {!isSupplierBaru && <span className="text-green-500 text-xs">(*Baru)</span>}</p>
                        <NamaSuppier value={postSupplier.nama_supplier} onChange={setPostSupplierTrigger} isFounded={setIsSupplierBaru} required={true} />
                    </div>
                    {!isSupplierBaru && (
                        <div className={"grid grid-cols-2 gap-3 mt-3"}>
                            <div className="flex flex-col">
                                <p className="text-sm">Alamat</p>
                                <InputTextarea
                                    id="alamat"
                                    value={postSupplier.alamat}
                                    onChange={(e) => setPostSupplier({...postSupplier, alamat: e.target.value})}
                                    required={!isSupplierBaru}
                                />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm">Deskripsi</p>
                                <InputTextarea
                                    id="deskripsi"
                                    value={postSupplier.deskripsi}
                                    onChange={(e) => setPostSupplier({...postSupplier, deskripsi: e.target.value})}
                                    required={!isSupplierBaru}
                                />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm">No. Telp</p>
                                <InputText
                                    id="nomor_telp"
                                    value={postSupplier.nomor_telp}
                                    onChange={(e) => setPostSupplier({...postSupplier, nomor_telp: e.target.value})}
                                    required={!isSupplierBaru}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid lg:grid-cols-4 mt-5 gap-3">
                    <div className="">
                        <p className="text-sm">Nomor Faktur</p>
                        <InputText
                            id="nomor_faktur"
                            className="w-full"
                            required={true}
                            value={postTransaksi.nomor_faktur}
                            onChange={(e) => setPostTransaksi({...postTransaksi, nomor_faktur: e.target.value})}
                        />
                    </div>
                    <div className="">
                        <p className="text-sm">Tanggal Faktur</p>
                        <Calendar
                            id="tanggal_faktur"
                            className="w-full"
                            required={true}
                            value={postTransaksi.tanggal_faktur}
                            onChange={(e) => setPostTransaksi({...postTransaksi, tanggal_faktur: e.target.value})}
                        />
                    </div>
                    <div className="">
                        <p className="text-sm">Tanggal Terima</p>
                        <Calendar
                            id="tanggal_terima"
                            className="w-full"
                            required={true}
                            value={postTransaksi.tanggal_terima}
                            onChange={(e) => setPostTransaksi({...postTransaksi, tanggal_terima: e.target.value})}
                        />
                    </div>
                    <div className="">
                        <p className="text-sm">Tanggal Jatuh Tempo</p>
                        <Calendar
                            id="tanggal_jatuh_tempo"
                            className="w-full"
                            required={true}
                            value={postTransaksi.tanggal_jatuh_tempo}
                            onChange={(e) => setPostTransaksi({...postTransaksi, tanggal_jatuh_tempo: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Keterangan Transaksi</p>
                        <InputText
                            id="keterangan"
                            value={postTransaksi.keterangan}
                            onChange={(e) => setPostTransaksi({...postTransaksi, keterangan: e.target.value})}
                            required={true}
                        />
                    </div>
                </div>
            </form>
            <div className="mt-5 flex justify-between">
                <button
                    type="button"
                    className="px-2 py-1 bg-vivid-cerulean text-white text-xs rounded-sm hover:bg-vivid-cerulean/75"
                    onClick={showDialogBarang}
                >
                    <i className="bi bi-cart4"></i> Tambah Barang
                </button>
                <div className="text-end">
                    <span className="mr-5">Total: </span><span className="font-bold text-lg">Rp. {uangDisplay(total)}, -</span>
                </div>
            </div>
            {/* table keranjang */}
            <div className="">
                <Table
                    data={dataTable}
                    options={{ 
                        show_page_limit_dropdown: false,
                        show_search_input: false,
                     }}
                    pagination={false}
                    filterFunc={filterFunc}
                    action={opsi}
                />
            </div>
            {/* end table keranjang */}
            <div className="mt-5">
                <button type="submit" form="form_transaksi" className="btn-primary">Simpan</button>
            </div>
            {/* form detail transaksi */}
            <Dialog
                header={'Tambah Barang'}
                visible={toggleDialogBarang}
                onHide={() => setToggleDialogBarang(false)}
            >
                <form onSubmit={addBarangHandler}>
                    <div className="flex flex-col mt-5">
                        <p className="text-sm">Nama Barang {!isBarangBaru && <span className="text-green-500 text-xs">(*Baru)</span>}</p>
                        <NamaBarang
                            isFounded={setIsBarangBaru}
                            value={postBarang.nama_barang}
                            onChange={setPostBarangTrigger}
                            required={true}
                        />
                    </div>
                {!isBarangBaru && (
                    <div className="grid lg:grid-cols-2 gap-3 mt-3">
                        <div className="flex flex-col">
                            <p className="text-sm">Kode Barang</p>
                            <InputText
                                id="kode_barang"
                                required={!isBarangBaru}
                                value={postBarang.kode_barang}
                                onChange={(e) => setPostBarang({...postBarang, kode_barang: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm">Satuan Barang</p>
                            <SatuanBarang
                                id="satuan_barang"
                                required={!isBarangBaru}
                                value={postBarang.satuan}
                                onChange={setPostSatuanBarangTrigger}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm">Kategori Barang</p>
                            <KategoriBarang
                                id="kategori_barang"
                                required={!isBarangBaru}
                                value={postBarang.kategrori}
                                onChange={setPostKategoriBarangTrigger}
                            />
                        </div>
                    </div>
                )}
                <div className="grid lg:grid-cols-2 gap-5 mt-5">
                    <div className="flex flex-col">
                        <p className="text-sm">No Batch</p>
                        <InputText
                            id="nomor_batch"
                            required={true}
                            value={postTransaksiDetailTransaksi.nomor_batch}
                            onChange={(e) => setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, nomor_batch: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Jumlah</p>
                        <InputText
                            id="qty"
                            required={true}
                            value={postTransaksiDetailTransaksi.qty}
                            keyfilter="int"
                            onChange={(e) => setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, qty: e.target.value, subtotal: parseInt(postTransaksiDetailTransaksi.harga_beli) * parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Harga Beli</p>
                        <InputText
                            id="harga_beli"
                            keyfilter="int"
                            required={true}
                            value={postTransaksiDetailTransaksi.harga_beli}
                            onChange={(e) => setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, harga_beli: e.target.value, subtotal: parseInt(postTransaksiDetailTransaksi.qty) * parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Harga Jual</p>
                        <InputText
                            id="harga_jual"
                            keyfilter="int"
                            required={true}
                            value={postTransaksiDetailTransaksi.harga_jual}
                            onChange={(e) => setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, harga_jual: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Expired Date</p>
                        <Calendar
                            id="expirate_date"
                            required={true}
                            value={postTransaksiDetailTransaksi.expirate_date}
                            onChange={(e) => setPostTransaksiDetailTransaksi({...postTransaksiDetailTransaksi, expirate_date: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <p className="text-sm">Sub Total</p>
                    {!isNaN(postTransaksiDetailTransaksi.subtotal) && (
                        <p className="font-bold">Rp{uangDisplay(postTransaksiDetailTransaksi.subtotal)}, -</p>
                    )}
                    {isNaN(postTransaksiDetailTransaksi.subtotal) && (
                        <p className="font-bold">Rp{uangDisplay(0)}, -</p>
                    )}
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="text-xs bg-vivid-cerulean text-white px-2 py-1 rounded-sm hover:bg-vivid-cerulean/75">
                        <i className="bi bi-cart4"></i> Tambah
                    </button>
                </div>
                </form>
            </Dialog>
        </>
    )
}

export default NewTransaksi;