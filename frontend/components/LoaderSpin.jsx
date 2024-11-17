import React from 'react'

const LoaderSpin = ({className}) => {
  return (
    <i className={"bi bi-arrow-clockwise absolute animate-spin "+className}></i>
  )
}

export default LoaderSpin;
