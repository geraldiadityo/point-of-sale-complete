'use client';
import { uangDisplay, tanggalDisplay, terbilang } from "@/utils/function";
import Table from "@/components/Table";


const TableDetailTransaksi = ({ 
    rekanan,
    details,
    filter,
    options,
    total,
    action
 }) => {
    return (
        <div className="">
            {rekanan && (
                <>
                    <div className="flex flex-col gap-5">
                        <div className="">
                            <div className="text-xl font-semibold">Detail</div>
                            <table className="mt-4 text-sm">
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="font-semibold pr-5">
                                                Tanggal Faktur
                                            </span>
                                        </td>
                                        <td>
                                            :{" "}
                                            {tanggalDisplay(rekanan.data.transaksi.tanggal_faktur)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-semibold pr-5">
                                                Tanggal Terima
                                            </span>
                                        </td>
                                        <td>
                                            :{" "}
                                            {tanggalDisplay(rekanan.data.transaksi.tanggal_terima)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-semibold pr-5">
                                                Tanggal Jatuh Tempo
                                            </span>
                                        </td>
                                        <td>
                                            :{" "}
                                            {tanggalDisplay(rekanan.data.transaksi.tanggal_jatuh_tempo)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-semibold pr-5">
                                                Nama Supplier
                                            </span>
                                        </td>
                                        <td>
                                            :{" "}
                                            {rekanan.data.transaksi.supplier.nama_supplier}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-semibold pr-5">
                                                Keterangan
                                            </span>
                                        </td>
                                        <td>
                                            :{" "}
                                            {rekanan.data.transaksi.keterangan}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-1">
                            {details && (
                                <Table
                                    data={details}
                                    filterFunc={filter}
                                    pagination={false}
                                    options={options}
                                    action={rekanan.data.transaksi.status ? (val) => <td></td> : action}
                                />
                            )}
                        </div>
                        <div className="mt-1">
                            <p className="">Total Bayar: Rp.{uangDisplay(total)}</p>
                            <p className="italic">Terbilang: "{terbilang(total)}"</p>
                            <p className="font-bold">Status: {rekanan.data.transaksi.status ? 'Final' : 'Belum Final'}</p>
                            <p className="font-bold">Status Bayar: {rekanan.data.transaksi.status_bayar ? 'Lunas' : 'Belum Lunas'}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
 }

export default TableDetailTransaksi;