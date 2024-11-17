import React from 'react'
import Link from 'next/link';


const Breadcrumb = ({data}) => {
  const lastIndex = data.length - 1;
  return (
    <>
      <div className="breadcrumb p-2">
        <ul className="text-xs text-gunmetal">
          {
            data.map((item, index) => (
              <li key={index} className='inline-block'>
                <i className={index === 0 ? 'bi bi-house-door-fill pr-1' : 'px-2 bi bi-chevron-right'}></i>
                {item.href && index !== lastIndex ? (<Link className='hover:text-oreoles-orange' href={item.href? item.href : ''}>{item.title}</Link>) :
                (<span>{item.title}</span>)
                }
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
}

export default Breadcrumb;
