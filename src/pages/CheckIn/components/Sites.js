import Site from './Site';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSites, useUpdateSites, useCoords } from '../../../context/DataContext'

const Sites = () => {
    const sites = useSites();
    const updateSites = useUpdateSites();
    const coords = useCoords();
    const [skipAmount, setSkipAmount] = useState(3);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    }

    if(sites.length === 0) {
        return (<div></div>)
    }

    const getNextSites = async () => {
        const [lng, lat] = coords.coordinates;
        

        axios
            .get(`http://localhost:3000/api/v1/sites?lng=${lng}&lat=${lat}&skip=${skipAmount}&limit=3`)
            .then(response => {
                updateSites(response.data.data.nearbySites)
                if(response.data.data.nearbySites.length !== 3) {
                    setSkipAmount(0);
                }
            });
    }

    return (
        <motion.div 
            className='sites'
            variants={container}
            initial="hidden"
            animate="show"
        >
            { 
                skipAmount !== 3 && 
                <button onClick={() => {
                    setSkipAmount((skipAmount) => skipAmount - 3);
                    getNextSites();
                }}>View Previous</button> 
            }
            {
                sites.map(site => (
                    <Site key={site._id} site={site}></Site>
                ))
            }
            { 
                <button onClick={() => {
                    setSkipAmount((skipAmount) => skipAmount + 3);
                    getNextSites()
                }}>View Next</button>
            }
        </motion.div>
    )
}

export default Sites;