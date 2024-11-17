import ShorterButton from "./ShorterButton";
import PaginationNav from "./PagginationNav";
import { LinkIconEdit, LinkIconHapus } from "./LinkIcon";
import { compareAandB } from "@/utils/function";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import LoaderSpin from "./LoaderSpin";
import { Dropdown } from 'primereact/dropdown';

const Table = ({
    data,
    searchParams,
    filterFunc,
    sorterFilterFunc,
    action,
    deleteHandler,
    pagination = true,
    editPage,
    searchHandler,
    pageSizeHandler,
    paginationHandler,
    options,
    editHandler,
    sortMethod='asc',
    show = 25,
    nomor=false
  }) => {
  
    // if(!data){
    //   data =  {
    //     columns: [
    //       { key: "norm", lable: "No" },
    //       { key: "nama_pasien", lable: "Column" },
    //            
    //     ],
    //     metadata: {
    //            counts: resData.totalItem,
    //            page: urlQuery.page,
    //            limit: urlQuery.pageSize,
    //            from: from,
    //            to: to,
    //    },
    //     data: [],
    //   };
    // }
  
    if (!options) {
      options = {
        show_page_limit_dropdown: true,
        show_search_input: true,
      };
    }
  
    const [selectedShow, setSelectedShow] = useState({
      name: "25", key: 25
    });
  
    const limits = [
      {"name": "25", "key": 25},
      {"name": "100", "key": 100},
      {"name": "500", "key": 500},
      {"name": "1000", "key": 1000},
    ]
  
    const actionDefault = action ? false : true;
    const [pageSize, setPageSize] = useState(25);
  
    const filter = (val, column, post) => {
      if (filterFunc) return filterFunc(val, column, post);
      return val;
    };
  
    const sorterFilter = (val, column, post) => {
      if (sorterFilterFunc) return sorterFilterFunc(val, column, post);
      return val;
    };
  
    const firstData = 0;
  
    const [dataSort, setDataSort] = useState(data.data);
    const [columns, setColumns] = useState(data.columns);
    const [metadata, setMetadata] = useState(data?.metadata);
  
    useEffect(() => {
      setDataSort(data.data);
      setColumns(data.columns);
      setMetadata(data?.metadata);
      setPageSize(data?.metadata?.limit);
    }, [data]);
  
    const [page, setPage] = useState(parseInt(searchParams?.page || "1"));
  
    const firstColumn = columns[firstData].key;
  
    const [columnActive, setColumnActive] = useState(firstColumn);
  
    const sortHandler = (childShortMethod, column) => {
      const newDataSort = [...dataSort];
      const newColumns = [...columns];
  
      newDataSort.sort((a, b) =>
        compareAandB(
          sorterFilter(a[column], column),
          sorterFilter(b[column], column),
          childShortMethod
        )
      );
      setColumnActive(column);
  
      setDataSort(newDataSort);
      setColumns(newColumns);
    };
  
    const [searchLoading, setSearchLoading] = useState(false);
    let timeOutId = null;
  
    const searchHandlerTrigger = (e) => {
      if (!searchHandler) return;
  
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
  
      timeOutId = setTimeout(async () => {
        setSearchLoading(true);
        const status = await searchHandler(e.target.value);
        setSearchLoading(status);
      }, 600);
    };
  
    const searchHandlerTriggerOnChange = (e) => {
      searchHandlerTrigger(e);
    };
  
    const searchHandlerTriggerOnKeyDown = async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!searchHandler) return;
  
        setSearchLoading(true);
        const status = await searchHandler(e.target.value);
        setSearchLoading(status);
      }
    };
  
    const limitChangeHandler = (e) => {
      if (!pageSizeHandler) {
        return;
      }
      setSelectedShow(e.value);
      pageSizeHandler(e.value.key);
    };
  
    useEffect(() => {
      sortHandler(sortMethod, firstColumn);
      setPageSize(metadata?.limit ?? 25);
    }, []);
  
    let no = 0;
  
    return (
      <div className="container w-full">
        <form action="">
          <div className="flex justify-between">
            {options.show_page_limit_dropdown && (
              <div className="">
                <label htmlFor="limit-show" className="text-sm">
                  show
                </label>
                <Dropdown inputId="limit-show" value={selectedShow} onChange={(e) => limitChangeHandler(e)} options={limits} optionLabel="name" 
                  placeholder="Select Show" className="ml-2"/>
              </div>
            )}
  
            {options.show_search_input && (
              <div className="">
                <label htmlFor="search" className="text-sm">
                  Search
                </label>
                <span className="">
                  <input
                    id="search"
                    type="text"
                    className="text-sm lg:ml-2 p-1 border border-x-tiffany-blue-light focus:outline-oreoles-orange/50"
                    onChange={searchHandlerTriggerOnChange}
                    onKeyDown={searchHandlerTriggerOnKeyDown}
                  />
                  {searchLoading && (
                    <LoaderSpin className={"right-4 text-gray-500"} />
                  )}
                </span>
              </div>
            )}
          </div>
        </form>
        <div className="mt-2 w-full overflow-auto">
          <table className="table-primary w-full border">
            <thead>
              <tr>
                {nomor && (
                  <th>No</th>
                )}
                {columns.map((val, index) => (
                  <th key={index} className="">
                    <div className="flex w-full justify-between">
                      <span>{val.lable}</span>
                      <ShorterButton
                        sortHandler={sortHandler}
                        column={val.key}
                        columnActive={columnActive}
                        status={columnActive === val.key ? "asc" : "none"}
                      />
                    </div>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
  
            <tbody>
              {dataSort.map((val, index) => (
                <tr key={index}>
                  {nomor && (<td>{++no}</td>)}
                  {columns.map((column, indexx) => (
                    <td key={indexx}>{filter(val[column.key], column.key, val, indexx)}</td>
                  ))}
                  {actionDefault && (
                    <td>
                      <div className="flex">
                        {!editHandler && (
                          <LinkIconEdit href={editPage + "?id=" + val.id} />
                        )}
                        {editHandler && (
                          <>
                            <p
                              className="edit px-2 cursor-pointer hover:text-flame"
                              onClick={(event) => editHandler(val, event)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </p>
                            <Tooltip anchorSelect=".edit" place="top">
                              Edit
                            </Tooltip>
                          </>
                        )}
                        <div className="">
                          <p
                            className="hapus px-2 cursor-pointer hover:text-flame"
                            onClick={(event) => deleteHandler(val, event)}
                          >
                            <i className="bi bi-trash"></i>
                          </p>
                          <Tooltip anchorSelect=".hapus" place="top">
                            Hapus
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                  )}
  
                  {!actionDefault && action(val)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col lg:flex-row justify-between w-full mt-2">
          {pagination && (
            <>
              <span className="text-xs text-gray-400 mb-2 lg:mb-0">
                Menampilkan {metadata.from + 1} hingga {metadata.to + 1} dari{" "}
                {metadata.counts} entry
              </span>
  
              {data && pageSize && metadata && (
                <PaginationNav
                  counts={metadata.counts}
                  page={metadata.page}
                  setPage={setPage}
                  limit={pageSize}
                  basePath="/"
                  paginationHandler={paginationHandler}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default Table;