import { useCoords } from '../../../context/DataContext';
import { motion } from 'framer-motion';

import '../styles/Site.scss';

const Site = ({ site }) => {
    const distance = site.distance.feet <= 500 ? `${site.distance.feet}ft` : `${site.distance.miles}mi`;
    const within1000feet = site.distance.feet <= 500;
    const [ originLng, originLat ] = site.location.coords.coordinates;
    const [ destLng, destLat ] = useCoords().coordinates;

    const siteVariant = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: {
                duration: 0.5,
            }
        }
    }

    return (
        <motion.div 
            className='site'
            variants={siteVariant}
        >
            <section className='site__header'>
                <h2 className='site__header__name'>{site.site}</h2>
            </section>
            
            <section className='site__details'>
                <div>
                    <h3 className="site__details__address">{site.location.address} {`${site.location.city}, ${site.location.state} ${site.location.zip}`}</h3>
                </div>
                <div className='site__details__checkIn'>
                    <h4 className={`site__details__distance site__details__distance--${within1000feet ? 'success' : 'fail'}`}>{distance}</h4>

                    <button
                        className={`secondary__button`}
                    >
                        <a
                            target="_blank"
                            href={`https://www.google.com/maps/dir/${originLat},${originLng}/${destLat},${destLng}`}
                        >
                        Get Directons</a>
                    </button>

                    <button
                        disabled={!within1000feet}
                        className={`primary__button${within1000feet ? '' : '--disabled'} site__details__checkIn__button`}
                    >Check-In</button>
                </div>
            </section>
        </motion.div>
    )
}

export default Site;