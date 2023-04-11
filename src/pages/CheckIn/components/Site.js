import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import { useCoords } from '../../../context/DataContext';

import '../styles/Site.scss';


const Site = ({ site, setError, setLoading }) => {
    const distance = site.distance.feet <= 20000 ? `${site.distance.feet}ft` : `${site.distance.miles}mi`;
    const within1000feet = site.distance.feet <= 20000;
    const [ originLng, originLat ] = site.location.coords.coordinates;
    const [ destLng, destLat ] = useCoords().coordinates;
    const navigate = useNavigate();

    const validateCheckIn = () => {
        setError('');
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const closestCenter = await axios
                .get(`http://localhost:3000/api/v1/sites?lng=${coords.longitude}&lat=${coords.latitude}&limit=1`)
                .then(response => response.data.data.nearbySites[0]);

            if(closestCenter.distance.feet <= 20000) {
                return navigate('/checkin/link');
            }

            setError(`Invalid check-in attempt: your current location must be within 20000 feet of the center to check-in. According to our location search you are ${closestCenter.distance.miles} mi away.`)
            setLoading(false);
        }, ({ code }) => {
            // Code 1 = 'Permissions Denied'
            if(code === 1) {
                setError('Whoops, it looks like location services are blocked on this computer. Please turn them on to continue.');
            }
            // Code 2 = 'Location Unavailable'
            if(code === 2) {
                setError('Internal error, please try again later.');
            }
            // Code 3 = 'Timeout'
            if(code === 3) {
                setError('Whoops, it looks like getting your location is taking longer than expected. Please try again later.');
            }

            setLoading(false);
        }, {
            timeout: 10000 // 10 seconds
        });
    }

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
                            rel="noreferrer"
                            href={`https://www.google.com/maps/dir/${originLat},${originLng}/${destLat},${destLng}`}
                        >
                        Get Directons</a>
                    </button>

                    <button
                        disabled={!within1000feet}
                        className={`primary__button${within1000feet ? '' : '--disabled'} site__details__checkIn__button`}
                        onClick={validateCheckIn}
                    >Check-In</button>
                </div>
            </section>
        </motion.div>
    )
}

export default Site;