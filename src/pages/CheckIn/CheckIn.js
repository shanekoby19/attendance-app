import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLoaderData } from 'react-router-dom';

import Sites from './components/Sites';
import LocationForm from './components/LocationForm';
import Map from './components/Map';
import { useSites } from '../../context/DataContext';

import './CheckIn.scss';

const CheckIn = () => {
    const sites = useSites();
    const mapIsExpanded = sites.length === 0;
    const { apiKeys, maxNumOfSites } = useLoaderData();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <div className='checkIn'>
            <motion.section 
                className='checkIn__search'
                initial={{ width: mapIsExpanded ? "10%" : "30%" }}
                animate={{ width: mapIsExpanded ? "30%" : "50%"}}
                transition={{
                    type: 'spring',
                    duration: 1.5,
                }}
            >
                <LocationForm 
                    apiKeys={apiKeys} 
                    mapIsExpanded={mapIsExpanded}
                    error={error}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                ></LocationForm>
                <Sites 
                    maxNumOfSites={maxNumOfSites}
                    error={error}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                ></Sites>
            </motion.section>
            <motion.section 
                initial={{ 
                    height: "90vh", 
                    width: mapIsExpanded ? "70%" : "50%" 
                }}
                animate={{ 
                    width: mapIsExpanded ? "70%" : "50%"
                }}
                transition={{
                    type: 'spring',
                    duration: 1.5,
                }}
            >
                <Map></Map>
            </motion.section>
        </div>
    )
}

export default CheckIn;