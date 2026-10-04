import { useState } from 'react'

import css from './FoodItemProduct.module.css'

const starGIcon = '/icons/starGIcon.png';
const starGrIcon = '/icons/starGrIcon.png';
const FoodItemProduct = (props) => {
    const item = props?.data || {};
    const { imgSrc, ttl, votes, price, desc, vegNonveg, mustTry, name, id } = item;
    const dataset = props?.dataset;
    const [readMore, setReadMore] = useState(false)
    const productName = ttl || name || 'Food Item';
    const priceValue = price || item.price || 0;
    const description = desc || item.description || 'Freshly prepared and served with care.';
    const voteText = votes || item.votes || 0;

    const addItem = () => {
      if (props.onAddToCart) {
        props.onAddToCart({ ...item, id: id || item.id, ttl: productName, price: priceValue, desc: description });
      }
    }

  return <div className={css.outerDiv} data-id={dataset} id={props.id}>
    <div className={css.innerDiv}>
        {imgSrc ? <div className={css.imgBox}>
            <img src={imgSrc} className={css.img} alt='food item' />
            <img src={vegNonveg} className={css.typeImg} alt='veg or nonveg' />
        </div> : <img src={vegNonveg || '/icons/veg.png'} className={css.typeImg2} alt="veg or nonveg" />}
        <div className={css.box}>
            <div className={css.ttl}>{productName}</div>
            {mustTry ? <div className={css.tag}>MUST TRY</div> : "" }
            <div className={css.ratings}>
                <div className={css.stars}>
                    <img src={starGIcon} className={css.starIcon} alt='star' />
                    <img src={starGIcon} className={css.starIcon} alt='star' />
                    <img src={starGIcon} className={css.starIcon} alt='star' />
                    <img src={starGrIcon} className={css.starIcon} alt='star' />
                    <img src={starGrIcon} className={css.starIcon} alt='star' />
                </div>
                <div className={css.votesTxt}>{voteText} votes</div>
            </div>
            <div className={css.price}>₹{priceValue}</div>
            <div className={css.desc}>
                {readMore ? description : `${description.substring(0, 100)}...`}
                {!readMore && description.length > 100 ? <span className={css.readMore} onClick={() => setReadMore(true)}>read more</span> : ""}
            </div>
            {props.onAddToCart ? <button type='button' className={css.addBtn || 'add-btn'} onClick={addItem}>Add</button> : null}
        </div>
    </div>
  </div>
}

export default FoodItemProduct