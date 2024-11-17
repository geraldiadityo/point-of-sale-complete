"use client";

import Breadcrumb from "@/components/Breadcrumb";
import TitleText from "@/components/TitleText";
import FormRole from "@/components/role/FormRole";
import { useState } from "react";

const AddRole = () => {
    const [post, setPost] = useState({
        nama_role: ""
    });

    return (
        <>
            <Breadcrumb
                data={[
                    {
                        title: 'Data Master',
                    },
                    {
                        title: 'Data Role',
                        href: '/role'
                    },
                    {
                        title: 'Add Role'
                    }
                ]}
            />
            <section className="p-2 mt-2">
                <div className="flex justify-between">
                    <div className="">
                        <TitleText
                            title="Form Add Role"
                        />
                    </div>
                </div>
                <div className="mt-5 w-full mb-[50px]">
                    <FormRole
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

export default AddRole;
