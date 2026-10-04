import React from 'react'

const nextIcon = '/icons/next.png';
const NextArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <img className={className}
    style={{ ...style}}
    onClick={onClick} src={nextIcon} />
  )
}

export default NextArrow