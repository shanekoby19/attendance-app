import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

import Sites from './components/Sites';
import LocationForm from './components/LocationForm';
import Map from './components/Map';
import { useSites } from '../../context/DataContext';

import './CheckIn.scss';

const CheckIn = () => {
    const sites = useSites();
    const mapIsExpanded = sites.length === 0;

    const [apiKeys, setApiKeys] = useState({});

    useEffect(() => {
        const getKeys = async() => {
            await axios.post('http://localhost:3000/api/v1/auth/login', {
                    email: 'skobylecky1@acelero.net',
                    password: 'root1234'
                }, { withCredentials: true });
            
            const res = await axios.get('http://localhost:3000/api/v1/keys', { withCredentials: true });
            const apiKeys = {};
            res.data.data.keys.forEach(key => apiKeys[key.name] = key.key)
            setApiKeys(apiKeys)
        }

        getKeys();
    }, [])

    // TODO: render a loading component while we get the API key from storage.
    if(!apiKeys['GOOGLE_API_KEY']) {
        return (
            <div>
            Loading...</div>
        )
    }

    return (
        <div className='checkIn'>
            <motion.section 
                initial={{ width: mapIsExpanded ? "10%" : "30%" }}
                animate={{ width: mapIsExpanded ? "30%" : "50%"}}
                transition={{
                    type: 'spring',
                    duration: 1.5,
                }}
            >
                <LocationForm apiKeys={apiKeys} mapIsExpanded={mapIsExpanded}></LocationForm>
                <Sites></Sites>
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