import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Collections from '../../components/HomeComponents/Collections/Collections';

import NavigationBar2 from '../../components/Navbars/NavigationBar2/NavigationBar2';
import CategorySelectionComp from '../../utils/OrderingUtils/CategorySelectionComp/CategorySelectionComp'
import FilterBox from '../../utils/OrderingUtils/FilterBox/FilterBox';
import CircleCard1 from '../../utils/Cards/CircleCards/CircleCard1/CircleCard1';
import CircleCard2 from '../../utils/Cards/CircleCards/CircleCard2/CircleCard2';
import ShowcaseCard from '../../utils/Cards/ShowcaseCard/ShowcaseCard'
import ExploreOptionsNearMe from '../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe'
import Footer from '../../components/Footer/Footer'
import CarouselUtil from '../../utils/CarouselUtil/CarouselUtil'

const dinning1 = '/icons/dinning1.png';
const dinning2 = '/icons/dinning2.png';
const delivery1 = '/icons/delivery1.png';
const delivery2 = '/icons/delivery2.png';
const nightlife1 = '/icons/nightlife1.png';
const nightlife2 = '/icons/nightlife2.png';
const filtersIcon = '/icons/filter.png';
const deliveryTimeIcon = '/icons/delivery-time.png';
const downArrowIcon = '/icons/down-arrow.png';
const biryaniCImg = '/icons/Food/biryaniC.png';
const burgerImg = '/icons/Food/burger.png';
const chickenImg = '/icons/Food/chicken.png';
const friesImg = '/icons/Food/fries.png';
const homestyleImg = '/icons/Food/homestyle.png';
const noodelsImg = '/icons/Food/noodels.png';
const pannerImg = '/icons/Food/panner.png';
const pizzaImg = '/icons/Food/pizza.png';
const sandwichImg = '/icons/Food/sandwich.png';
const shawarmaImg = '/icons/Food/shawarma.png';
const kfcImg = '/icons/Brands/kfc.png';
const pizzahutImg = '/icons/Brands/pizzahut.png';
const scoopsImg = '/icons/Brands/scoops.png';
const biryaniSCImg = '/images/Food/biryani.png';
const biryaniSCImg2 = '/images/Food/biryani2.png';
const chapathiImg = '/images/Food/chapathi.png';
const chickenSCImg = '/images/Food/chicken.png';
const fishImg = '/images/Food/fish.png';
const icecreamImg = '/images/Food/icecream.png';
const kfcSCImg = '/images/Food/kfc.png';
const pizzaSCImg = '/images/Food/pizza.png';
import { orderOnlinePage, diningOutPage, nightLifePage } from '../../helpers/constants'

import css from './ShowCase.module.css';

let ShowCase = () => {
    let location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get('page');

    let [isActive, setIsActive] = useState({
        delivery: page === orderOnlinePage,
        dinning: page === diningOutPage,
        nightlife: page === nightLifePage
    });
    let filterBoxes;

    let filters = {
        delivery: [
            { text: "Filter", leftIcon: filtersIcon },
            { text: "Delivery Time", leftIcon: deliveryTimeIcon },
            { text: "Pure Veg" },
            { text: "Rating: 4.0+" },
            { text: "Freate Offers" },
            { text: "Cuisines", leftIcon: downArrowIcon },
        ],
        dinning: [
            { text: "Filter", leftIcon: filtersIcon },
            { text: "Rating: 4.0+" },
            { text: "Outdoor Seating" },
            { text: "Serves Alcohal" },
            { text: "Open Now" },
        ],
        nightLife: [
            { text: "Filter", leftIcon: filtersIcon },
            { text: "Distance", leftIcon: deliveryTimeIcon },
            { text: "Rating: 4.0+" },
            { text: "Pubs & Bars" },
        ]
    }
    if (page === orderOnlinePage) {
        filterBoxes = filters?.delivery?.map((val, id) => {
            return <div key={id}><FilterBox leftIcon={val?.leftIcon ?? null} rightIcon={val?.rightIcon ?? null} text={val.text} /></div>
        })
    } else if (page === diningOutPage) {
        filterBoxes = filters?.dinning?.map((val, id) => {
            return <div key={id}><FilterBox leftIcon={val?.leftIcon ?? null} rightIcon={val?.rightIcon ?? null} text={val.text} /></div>
        })
    } else if (page === nightLifePage) {
        filterBoxes = filters?.nightLife?.map((val, id) => {
            return <div key={id}><FilterBox leftIcon={val?.leftIcon ?? null} rightIcon={val?.rightIcon ?? null} text={val.text} /></div>
        })
    }

    const foodCardScroll = [
        {
            name: "Biryani",
            imgSrc: biryaniCImg
        },
        {
            name: "Burger",
            imgSrc: burgerImg
        },
        {
            name: "Chicken",
            imgSrc: chickenImg
        },
        {
            name: "Fries",
            imgSrc: friesImg
        },
        {
            name: "Home Style",
            imgSrc: homestyleImg
        },
        {
            name: "Noodles",
            imgSrc: noodelsImg
        },
        {
            name: "Panner",
            imgSrc: pannerImg
        },
        {
            name: "Pizza",
            imgSrc: pizzaImg
        },
        {
            name: "Sandwich",
            imgSrc: sandwichImg
        },
        {
            name: "Shawarma",
            imgSrc: shawarmaImg
        },
    ]

    const brandsCardScroll = [
        {
            name: "KFC",
            imgSrc: kfcImg,
            time: "45"
        },
        {
            name: "Pizza Hut",
            imgSrc: pizzahutImg,
            time: "35"
        },
        {
            name: "Scoops",
            imgSrc: scoopsImg,
            time: "49"
        },
        {
            name: "KFC",
            imgSrc: kfcImg,
            time: "19"
        },
        {
            name: "Pizza Hut",
            imgSrc: pizzahutImg,
            time: "22"
        },
        {
            name: "Scoops",
            imgSrc: scoopsImg,
            time: "33"
        },
    ]

    const items = [
        {
            promoted: true,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "Paradise Hotel",
            rating: '3.6',
            imgSrc: biryaniSCImg
        },
        {
            promoted: false,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "Mangal Hotel",
            rating: '2.6',
            imgSrc: biryaniSCImg2
        },
        {
            promoted: true,
            time: "30",
            offB: false,
            proExtraB: true,
            off: "30",
            proExtra: "40",
            name: "Chapathi Hotel",
            rating: '4.6',
            imgSrc: chapathiImg
        },
        {
            promoted: false,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "Fish Mandi Hotel",
            rating: '4.9',
            imgSrc: fishImg
        },
        {
            promoted: true,
            time: "25",
            offB: false,
            proExtraB: true,
            off: "30",
            proExtra: "40",
            name: "MangalCaptain Hotel",
            rating: '4.6',
            imgSrc: icecreamImg
        },
        {
            promoted: false,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "KFCS Hotel",
            rating: '2.8',
            imgSrc: kfcSCImg
        },
        {
            promoted: true,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "Pizza Hotel",
            rating: '3.2',
            imgSrc: pizzaSCImg
        },
        {
            promoted: false,
            time: "25",
            offB: true,
            proExtraB: false,
            off: "30",
            proExtra: "40",
            name: "Fish Mandi Hotel",
            rating: '4.6',
            imgSrc: fishImg
        },
        {
            promoted: true,
            time: "25",
            offB: false,
            proExtraB: true,
            off: "30",
            proExtra: "40",
            name: "MangalCaptain Hotel",
            rating: '2.6',
            imgSrc: icecreamImg
        },
    ]

    return <div className={css.outerDiv}>
        <NavigationBar2 />
        <div className={css.innerDiv}>
            <div className={css.breadcrumb}>
                Home
                /
                India
                /
                Hyderabad
                /
                Hyderabad City
                /
                Indira Nagar
            </div>
        </div>
        <div className={css.showCaseDiv}>
            <div className={css.showcaseComps}>
                <CategorySelectionComp title="Delivery" imgSrc={delivery1} imgSrc2={delivery2} color="#FCEEC0" comp='delivery' isActive={isActive} setIsActive={setIsActive} />
                <CategorySelectionComp title="Dinning" imgSrc={dinning1} imgSrc2={dinning2} color="#EDF4FF" comp='dinning' isActive={isActive} setIsActive={setIsActive} />
                <CategorySelectionComp title="NightLife" imgSrc={nightlife1} imgSrc2={nightlife2} color="#EDF4FF" comp='nightlife' isActive={isActive} setIsActive={setIsActive} />
            </div>
        </div>
        {page !== orderOnlinePage ?
            <div className={css.innerDiv2}>
                <div className={css.w7}>
                    <Collections />
                </div>
            </div> : null}
        <div className={css.innerDiv3}>
            <div className={css.filtersDiv}>
                {filterBoxes}
            </div>
        </div>
        {page === orderOnlinePage ? <div className={css.innerDiv4}>
            <div className={css.w7}>
                <div className={css.innerDiv4Title}>
                    Inspiration for your first order
                </div>
                <div className={css.rollerCarosuel}>
                    <CarouselUtil>
                        {foodCardScroll?.map((val, id) => {
                            return <div className={css.cardW} key={id}>
                                <CircleCard1 imgSrc={val.imgSrc} name={val.name} />
                            </div>
                        })}
                    </CarouselUtil>
                </div>
            </div>
        </div> : null}
        {page === orderOnlinePage ? <div className={css.innerDiv5}>
            <div className={css.w7}>
                <div className={css.innerDiv5Title}>
                    Top brands for you
                </div>
                <div className={css.rollerCarosuel}>
                    <CarouselUtil>
                        {brandsCardScroll?.map((val, id) => {
                            return <div className={css.cardW} key={id}>
                                <CircleCard2 imgSrc={val.imgSrc} name={val.name} time={val.time} />
                            </div>
                        })}
                    </CarouselUtil>
                </div>
            </div>
        </div> : null}
        <div className={css.innerDiv6}>
            <div className={css.w7}>
                <div className={css.innerDiv6Title}>
                    {page === orderOnlinePage ? "Delivery Restaurants in Gachibowli" : page === diningOutPage ? "Dine-Out Restaurants in Gachibowli" : "Nightlife Restaurants in Gachibowli"}
                </div>
                <div className={css.innerDiv6Body}>
                    {items?.map((item, id) => {
                        return <ShowcaseCard key={id} promoted={item.promoted} time={item.time} offB={item.offB} proExtraB={item.proExtraB} off={item.off} proExtra={item.proExtra} name={item.name} rating={item.rating} imgSrc={item.imgSrc} />
                    })}
                </div>
            </div>
        </div>
        <ExploreOptionsNearMe />
        <Footer />
    </div>
}

export default ShowCase;