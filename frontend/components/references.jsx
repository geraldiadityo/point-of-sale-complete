"use client";
import { AutoComplete } from "primereact/autocomplete";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import useDebounce from "@/hooks/useDebounce";

export const KategoriBarang = ({ 
    value,
    onChange,
    className="",
    placeholder="[Kategori]",
    required=false
 }) => {
    const [items, setItems] = useState([]);
    const [kategories, setKategories] = useState([]);

    useEffect(() => {
        const getListKategori = async () => {
            const res = await fetch(`${backendhost}/api/kategori/view`,{
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();
            setKategories([...resData.data]);
        };

        getListKategori()
    },[]);

    const [valueLocal, setValueLocal] = useState();
    
    const setValueGenerik = (val) => {
        if(!onChange){
            setValueLocal(val);
            return;
        }

        onChange(val);
    }

    const search = (e) => {
        const searchedKategoris = kategories.filter((item) => {
            return item.nama_kategori.toLowerCase().includes(e.query.toLowerCase());
        });

        setItems([...searchedKategoris]);
    };

    const itemTemplate = (val) => {
        return (
            <>
                <span className="">{val.id}</span> | {" "}
                <span className="">{val.nama_kategori}</span>
            </>
        )
    }

    const seletedItemTemplate = (val) => {
        return val.nama_kategori
    };

    return (
        <>
            <AutoComplete
                itemTemplate={itemTemplate}
                selectedItemTemplate={seletedItemTemplate}
                suggestions={items}
                completeMethod={search}
                value={value ?? valueLocal}
                onChange={(e) => setValueGenerik(e.target.value)}
                className={className}
                placeholder={placeholder}
                dropdown={true}
                required={required}
            />
        </>
    )
 };

 export const SatuanBarang = ({ 
    value,
    onChange,
    className="",
    placeholder="[Satuan]",
    required=false
 }) => {
    const [items, setItems] = useState([]);
    const [satuans, setSatuans] = useState([]);

    useEffect(() => {
        const getListSatuan = async () => {
            const res = await fetch(`${backendhost}/api/satuan/view`,{
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();
            setSatuans([...resData.data]);
        };

        getListSatuan()
    },[]);

    const [valueLocal, setValueLocal] = useState();
    
    const setValueGenerik = (val) => {
        if(!onChange){
            setValueLocal(val);
            return;
        }

        onChange(val);
    }

    const search = (e) => {
        const searchedSatuans = satuans.filter((item) => {
            return item.nama_satuan.toLowerCase().includes(e.query.toLowerCase());
        });

        setItems([...searchedSatuans]);
    };

    const itemTemplate = (val) => {
        return (
            <>
                <span className="">{val.id}</span> | {" "}
                <span className="">{val.nama_satuan}</span>
            </>
        )
    }

    const seletedItemTemplate = (val) => {
        return val.nama_satuan
    };

    return (
        <>
            <AutoComplete
                itemTemplate={itemTemplate}
                selectedItemTemplate={seletedItemTemplate}
                suggestions={items}
                completeMethod={search}
                value={value ?? valueLocal}
                onChange={(e) => setValueGenerik(e.target.value)}
                className={className}
                placeholder={placeholder}
                dropdown={true}
                required={required}
            />
        </>
    )
 };

export const NamaSuppier = ({
    value,
    onChange,
    className="",
    placeholder="[Supplier]",
    isFounded,
    required=false
}) => {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [query, setQuery] = useState({
        keyword: ""
    });
    const debounceKeyword = useDebounce(query.keyword, 500);
    

    useEffect(() => {
        const getListSupplier = async () => {
            const res = await fetch(`${backendhost}/api/supplier/search-supplier?keyword=${debounceKeyword}`,{
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }
            
            const resData = await res.json();

            if(isFounded){
                if(resData.data.length <= 0){
                    isFounded(false)
                } else {
                    isFounded(true);
                }
            }

            setItems([...resData.data]);
            setSuppliers([...resData.data]);
        }

        getListSupplier()
    },[debounceKeyword]);

    const [valueLocal, setValueLocal] = useState();
    
    const setValueGenerik = (val) => {
        if(!onChange){
            setValueLocal(val);
            return;
        }
        onChange(val);
    };

    const search = (e) => {
        setQuery({...query, keyword: e.query});
    };

    const itemTemplate = (val) => {
        return (
            <>
                <span className="">{val.id}</span> |{" "}
                <span className="">{val.nama_supplier}</span> |{" "}
                <span className="">{val.alamat}</span> |{" "}
                <span className="">{val.nomor_telp}</span> |{" "}
                <span className="">{val.deskripsi}</span>
            </>
        )
    };

    const seletedItemTemplate = (val) => {
        return val.nama_supplier;
    }

    return (
        <>
            <AutoComplete
                itemTemplate={itemTemplate}
                seletedItemTemplate={seletedItemTemplate}
                suggestions={items}
                completeMethod={search}
                value={value ?? valueLocal}
                onChange={(e) => setValueGenerik(e.target.value)}
                className={className}
                placeholder={placeholder}
                dropdown={true}
                required={required}
            />
        </>
    )
};

export const NamaBarang = ({
    value,
    onChange,
    className="",
    placeholder="[Barang]",
    isFounded,
    required=false,
}) => {
    const [items, setItems] = useState([]);
    const [barangs, setBarangs] = useState([]);
    const [query, setQuery] = useState({
        keyword: ""
    });
    const debounceKeyword = useDebounce(query.keyword, 500);

    useEffect(() => {
        const getListBarang = async () => {
            const res = await fetch(`${backendhost}/api/barang/search-barang?keyword=${debounceKeyword}`, {
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();
            
            if(isFounded){
                if(resData.data.length <= 0){
                    isFounded(false)
                } else {
                    isFounded(true)
                }
            }

            setItems([...resData.data]);
            setBarangs([...resData.data]);
        }

        getListBarang();
    }, [debounceKeyword]);

    const [valueLocal, setValueLocal] = useState();
    
    const setValueGenerik = (val) => {
        if(!onChange){
            setValueLocal(val);
            return;
        }

        onChange(val);
    };

    const search = (e) => {
        setQuery({...query, keyword: e.query});
    }

    const itemTemplate = (val) => {
        return (
            <>
                <div className="">
                    <span className="">{val.kode_barang}</span> |{" "}
                    <span className="">{val.nama_barang}</span> |{" "}
                </div>
                <div className="text-sm text-gray-500">
                    <span className="">{val.kategori.nama_kategori}</span> |{" "}
                    <span className="">{val.satuan.nama_satuan}</span> |{" "}
                </div>
            </>
        )
    };

    const seletedItemTemplate = (val) => {
        return val.nama_barang;
    };

    return (
        <>
            <AutoComplete
                itemTemplate={itemTemplate}
                selectedItemTemplate={seletedItemTemplate}
                suggestions={items}
                completeMethod={search}
                value={value ?? valueLocal}
                onChange={(e) => setValueGenerik(e.target.value)}
                className={className}
                placeholder={placeholder}
                dropdown={true}
                required={required}
            />
        </>
    )
};