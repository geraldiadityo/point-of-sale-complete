"use client";
import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import FormPegawai from "@/components/pegawai/FormPegawai";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";

const UpdatePegawai = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [post, setPost] = useState({
        nik: "",
        nama_lengkap: "",
        alamat: "",
    });

    const id = searchParams.get('id') ?? false;

    if(!id){
        router.push("/pegawai");
        router.refresh();
    }

    useEffect(() => {
        const getPostById = async () => {
            const dataApi = await fetch(`${backendhost}/api/pegawai/view/${id}`, {
                method: 'GET',
                headers: await headers()
            });

            const data = await dataApi.json();
            setPost({
                id: data.data.id,
                nik: data.data.nik,
                nama_lengkap: data.data.nama_lengkap,
                alamat: data.data.alamat
            });
        }

        getPostById()
    }, []);

    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Data Master',
                    },
                    {
                        title: 'Data Pegawai',
                        href: '/pegawai'
                    },
                    {
                        title: 'Update Pegawai'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex justify-between">
                    <div className="">
                        <TitleText
                            title="Form Update Pegawai"
                        />
                    </div>
                </div>
                <div className="mt-5 w-full mb-[50px]">
                    {post && (
                        <FormPegawai
                            post={post}
                            setPost={setPost}
                            method="PUT"
                            title="Update"
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default UpdatePegawai;
