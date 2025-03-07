"use client";

import Breadcrumb from "../Breadcrumb";
import { TabView, TabPanel } from 'primereact/tabview';
import BarangPage from "./Barang";
import KategoriPage from "./Kategori";
import SatuanPage from "./Satuan";
import TransaksiPage from "./Transaksi";
import StokPage from "./Stok";

const InventoryPage = () => {
    
    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data'
                    },
                    {
                        title: 'Inventory',
                        href: '/inventory'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <TabView >
                    <TabPanel header="Data Barang" leftIcon="bi bi-list mr-2">
                        <BarangPage />
                    </TabPanel>
                    <TabPanel header="Data Kategori" leftIcon="bi bi-list mr-2">
                        <KategoriPage />
                    </TabPanel>
                    <TabPanel header="Data Satuan" leftIcon="bi bi-list mr-2">
                        <SatuanPage />
                    </TabPanel>
                    <TabPanel header="Data Transaksi" leftIcon="bi bi-list mr-2">
                        <TransaksiPage />
                    </TabPanel>
                    <TabPanel header="Data Stok" leftIcon="bi bi-list mr-2">
                        <StokPage />
                    </TabPanel>
                </TabView>
            </section>
        </>
    )
}

export default InventoryPage