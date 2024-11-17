"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import Table from "@/components/Table";
import Link from "next/link";
import LoaderSpin from "@/components/LoaderSpin";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";
import Swal from "sweetalert2";

const RolePage = () => {
    const [submitting, setSubmitting] = useState(false);
    const [dataApi, setDataApi] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        const getRoles = async () => {
            const res = await fetch(`${backendhost}/api/role/view`, {
                method: 'GET',
                headers: await headers(),
            });

            const dataRes = await res.json();
            const newData = { ...data, data: dataRes };
            setDataApi(newData);
        }

        getRoles();
    }, []);

    useEffect(() => {
        if(!dataApi) return;

        setData({
            columns: [
                { key: 'id', lable: 'Id' },
                { key: 'nama_role', lable: 'Nama Role' }
            ],
            data: dataApi.data.data
        });
    }, [dataApi]);

    const deleteHandler = async (post) => {
        const result = await Swal.fire({
            title: 'Apakah Kamu Yakin?',
            text: "Ingin menghapus data Role ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
        
        if(result.isConfirmed){
            const res = await fetch(`${backendhost}/api/role/delete-role/${post.id}`, {
                method: 'DELETE',
                headers: await headers(),
            });

            const dataApiNew = await res.json();
            const filteredPost = data.data.filter((p) => p.id !== post.id);
            const newData = { ...data, data: filteredPost };
            setData(newData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: dataApiNew.message
            })
        }
    }

    const options = {
        show_page_limit_dropdown: false,
        show_search_input: false
    }

    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data',
                    },
                    {
                        title: 'Data Role',
                        href: '/role'
                    }
                ]}
            />

            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Role"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <Link href="/role/new" className="lg:ml-2 btn-primary" onClick={() => setSubmitting(true)}>Add Role {submitting && (<LoaderSpin />)}</Link>
                    </div>
                </div>
                <div className="mt-3 w-full">
                    {data && (
                        <Table
                            data={data}
                            pagination={false}
                            deleteHandler={deleteHandler}
                            editPage="/role/update-role"
                            options={options}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default RolePage;