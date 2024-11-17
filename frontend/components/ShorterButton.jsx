import { useEffect, useState } from "react";

const ShorterButton = ({sortHandler, status = 'none', column, columnActive}) => {

    const stat = {
      none: 'none',
      asc: 'asc',
      desc: 'desc'
    }
  
    const [sort, setSort] = useState(status);
  
    const [statCss, setStatCss] = useState(status === 'asc' ? 'desc' : 'asc');
  
    useEffect(() => {
      setSort(status)
      sortHandler(sort, column)
    },[]);
  
    
  
    const toggleSort = () => {
      if(sort === stat.none){
        setSort(stat.asc);
        setStatCss(stat.desc);
      }
      else if(sort === stat.asc){
        setSort(stat.desc);
        setStatCss(stat.none);
      }
      else{
        setSort(stat.none);
        setStatCss(stat.asc);
      }
  
      sortHandler(statCss, column)
    }
  
    return (
      <div className="flex cursor-pointer" onClick={toggleSort}>
          <i className={`bi bi-arrow-up -mr-1 ${columnActive === column ? sort === 'asc' ? 'text-flame' : 'text-gray-300' : 'text-gray-300' }`}></i><i className={`bi bi-arrow-down ${columnActive === column ? sort === 'desc' ? 'text-flame' : 'text-gray-300' : 'text-gray-300' }`}></i>
      </div>
    );
      
}
  
export default ShorterButton;
