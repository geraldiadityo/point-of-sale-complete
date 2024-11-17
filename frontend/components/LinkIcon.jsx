
import Link from "next/link";
import {Tooltip} from "react-tooltip";

const LinkIcon = ({href, bsIcon, tooltipTitle, color='vivid-cerulean', className='', idToolTip, editHandler}) => {


    return (
        <div className={className}>
            <Link href={href} className={idToolTip}><i className={`bi bi-${bsIcon} text-${color} hover:text-flame`}></i></Link>
            <Tooltip anchorSelect={`.${idToolTip}`} place="top">{tooltipTitle}</Tooltip>
        </div>
    )
}

export const LinkIconHapus = ({href, deleteHandler}) => {
    return (
      <LinkIcon
          idToolTip='hapus'
          href={href}
          bsIcon="trash-fill"
          tooltipTitle="Hapus"
          color="flame"
          className="ml-2"
      />
    )
  }
  
  export const LinkIconEdit = ({href, editHandler}) => {
      return (
          <LinkIcon
              idToolTip='edit'
              href={href}
              bsIcon='pencil-square'
              tooltipTitle='Edit'
          />
      )
  }

export default LinkIcon;