import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import TitleText from "@/components/TitleText";
import Table from "@/components/Table";
import { tanggalDisplay, uangDisplay } from "@/utils/function";

const TableBatch = ({ post }) => {
    const [id, setId] = useState(post.id ?? '');
    const dataInital = {
        columns: [
            { key: 'nomor', lable: 'Nomor Batch' },
            { key: 'stok', lable: 'Stok' },
            { key: 'harga_jual', lable: 'Harga' },
            { key: 'expirate_date', lable: 'Exp Date' }
        ],
        data: []
    };
    const [dataApi, setDataApi] = useState();
    const [data, setData] = useState(dataInital);
    
    useEffect(() => {
        const getBatch = async () => {
            const res = await fetch(`${backendhost}/api/batch/view/${id}`, {
                method: 'GET',
                headers: await headers(),
            });
            const newData = await res.json();
            setDataApi(newData);
        };

        getBatch()
    }, []);

    useEffect(() => {
        if (!dataApi) return;

        setData({
            ...data,
            data: dataApi.data
        });
    }, [dataApi]);

    const option = {
        show_page_limit_dropdown: false,
        show_search_input: false
    };

    const filterFunc = (val, column) => {
        if(column === 'expirate_date'){
            return tanggalDisplay(val);
        } else if (column === 'harga_jual'){
            return (
                <p>Rp {uangDisplay(val)}</p>
            )
        }
        
        return val;
    }

    return (
        <>
            <section className="p-2 mt-2">
                <div className="">
                    <TitleText
                        title={`Data Batch Barang: ${post.nama_barang}`}
                    />
                </div>
                <div className="mt-5">
                    {data && (
                        <Table
                            data={data}
                            filterFunc={filterFunc}
                            nomor={true}
                            pagination={false}
                            options={option}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default TableBatch;