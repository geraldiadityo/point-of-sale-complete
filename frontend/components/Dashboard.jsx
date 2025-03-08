"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import TitleText from "./TitleText";
import { CardStat } from "./DashboardComponent";
import { uangDisplay } from "@/utils/function";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";


const Dashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        transaksi: 0,
    });

    useEffect(() => {
        const getDataDasboard = async () => {
            const res = await fetch(`${backendhost}/api/dashboard/get-data-dashboard`, {
                method: 'GET',
                headers: await headers()
            });

            if(!res.ok){
                return;
            }

            const resData = await res.json();
            setDataDashboard({...resData.data});
        }

        getDataDasboard();
    }, []);


    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Dashboard',
                        href:"/"
                    }
                ]}
            />

            <section className="p-2 mt-2">
                <TitleText
                    title="Dashboard"
                />
                {dataDashboard && (
                    <div className="container mt-5 grid grid-col-1 lg:grid-2 gap-5">
                        <CardStat
                            title={'Total Transaksi Barang Hari ini'}
                            data={`Rp ${uangDisplay(dataDashboard.transaksi)}`}
                            icon={'file-bar-graph-fill'}
                            colorTheme={'purple'}
                        />
                    </div>
                )}
            </section>
        </>
    )
}

export default Dashboard;