import Link from "next/link";
import { paginationArray, sanitizePagination } from "@/utils/function";
import { useState, useEffect } from "react";

const PaginationNav = ({counts, page, limit, maxPage=7, basePath='/', paginationHandler, searchParams, setPage}) => {
    
    const pageNavCount = Math.ceil(counts / limit);
    const lastPage = pageNavCount;

    const [pagination, setPagination] = useState();

    useEffect(() => {
        setPagination(paginationArray(page, lastPage));
    }, [limit, counts, page]);

    const sentToParrent = (val, e) => {
        try {
            paginationHandler(val, e);
            setPage(val);
            const newArr = [...paginationArray(val, lastPage)];
            setPagination(newArr);
        } catch (error) {
            console.log(error);
        }
        
    }

  return (
    <div className='text-xs'>
        <ul>
            {pagination && pagination.map((val, index) => (
                <li key={index} className='inline-block'>
                    {val !== '...'? val === page ? (<span className='px-2 text-flame font-bold'>{val}</span>) : (<Link onClick={(e) => sentToParrent(sanitizePagination(val,page),e)} href={basePath+`?page=${val === 'next' ? page+1 : val === 'prev' ? page-1 : val}`} className={`px-2`}>{val}</Link>) : (<span>{val}</span>)}
                </li>
            ))
            }
            
        </ul>
    </div>
  )
}

export default PaginationNav;