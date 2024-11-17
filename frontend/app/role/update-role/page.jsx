"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import FormRole from "@/components/role/FormRole";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { backendhost } from "@/utils/config";
import { headers } from "@/utils/headers";

const UpdateRoles = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [post, setPost] = useState({
        nama_role: ''
    });

    const id = searchParams.get('id') ?? false;

    if(!id){
        router.push("/role");
        router.refresh();
    }

    useEffect(() => {
        const getPostById = async () => {
            const dataApi = await fetch(`${backendhost}/api/role/view/${id}`, {
                method: 'GET',
                headers: await headers(),
            });
            const data = await dataApi.json();
            setPost({
                id: data.data.id,
                nama_role: data.data.nama_role
            });
        }


        getPostById();
    }, []);

    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Master Data',
                    },
                    {
                        title: "Data Role",
                        href: '/role'
                    },
                    {
                        title: 'Update Role'
                    }
                ]}
            />

            <section className="p-2 mt-2">
                <div className="flex justify-between">
                    <div className="">
                        <TitleText
                            title="Form Update Data Role"
                        />
                    </div>
                </div>
                <div className="mt-5 w-full mb-[50px]">
                    {post && (
                        <FormRole
                            post={post}
                            setPost={setPost}
                            title="UPDATE"
                            method="PUT"
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default UpdateRoles;