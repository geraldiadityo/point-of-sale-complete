"use client";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import HistoryRekanan from "./transaksi/HistoryTransaksi";
import NewTransaksi from "./transaksi/NewTransaksi";
const TransaksiPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const headerNewTransaksi = (options) => {
        return (
            <>
                <button onClick={options.onClick} className="btn-primary ml-2">Transaksi Baru</button>
            </>
        );
    }

    const headerHistory = (options) => {
        return (
            <>
                <button onClick={options.onClick} className="btn-primary">History</button>
            </>
        );
    }

    return (
        <>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel headerTemplate={headerHistory}>
                    <HistoryRekanan />
                </TabPanel>
                <TabPanel headerTemplate={headerNewTransaksi}>
                    <NewTransaksi setActiveIndex={setActiveIndex} />
                </TabPanel>
            </TabView>
        </>
    )
}

export default TransaksiPage;
