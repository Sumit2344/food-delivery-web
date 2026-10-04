import React from 'react'

import css from './SmallSearchBarUtil.module.css'

const searchIcon = '/icons/search.png';
const SmallSearchBarUtil = ({ placeholder, value, onChange }) => {
  return <div className={css.outerDiv}>
    <div className={css.innerDiv}>
      <div className={css.searchBox}>
        <img src={searchIcon} alt="cancel icon" className={css.srchIcon} />
        <input
          type="search"
          placeholder={placeholder}
          className={css.inpt}
          value={value}
          onChange={onChange}
          aria-label={placeholder || 'Search'}
        />
      </div>
    </div>
  </div>
}

export default SmallSearchBarUtil