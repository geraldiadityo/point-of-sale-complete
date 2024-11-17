"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import FormPegawai from "@/components/pegawai/FormPegawai";
import { useState } from "react";

const AddPegawai = () => {
    const [post, setPost] = useState({
        nik: "",
        nama_lengkap: "",
        alamat: ""
    });

    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: "Master Data",
                    },
                    {
                        title: 'Data Pegawai',
                        href: '/pegawai'
                    },
                    {
                        title: 'Add Pegawai',
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex justify-between">
                    <div className="">
                        <TitleText
                            title="Add Pegawai"
                        />
                    </div>
                </div>
                <div className="mt-5 w-full mb-[50px]">
                    <FormPegawai
                        post={post}
                        setPost={setPost}
                        title="Add"
                        method="POST"
                    />
                </div>
            </section>
        </>
    )
}

export default AddPegawai;