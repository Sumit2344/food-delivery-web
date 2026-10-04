import React from 'react'

const prevIcon = '/icons/prev.png';
const PrevArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <img className={className}
    style={{ ...style}}
    onClick={onClick} src={prevIcon} />
  )
}

export default PrevArrow