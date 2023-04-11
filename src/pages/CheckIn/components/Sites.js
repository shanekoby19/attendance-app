import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';


import { useSites, useUpdateSites, useCoords } from '../../../context/DataContext'
import Site from './Site';
import Loader from '../../Miscellaneous/components/Loader';

import '../styles/Sites.scss';

const Sites = ({ maxNumOfSites, error, setError, loading, setLoading }) => {
    const sites = useSites();
    const updateSites = useUpdateSites();
    const coords = useCoords();
    const maxPages = maxNumOfSites % 3 !== 0 ? Math.floor(maxNumOfSites / 3) + 1 : maxNumOfSites / 3;
    const [currentPage, setCurrentPage] = useState(1);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    }

    if(loading) {
        return <Loader message="One second, we're calculating your location..."/>
    }

    if(sites.length === 0) {
        return (<div></div>)
    }

    const getNextSites = async (skipAmount) => {
        const [lng, lat] = coords.coordinates;
        
        axios
            .get(`http://localhost:3000/api/v1/sites?lng=${lng}&lat=${lat}&skip=${skipAmount}&limit=3`)
            .then(response => updateSites(response.data.data.nearbySites));
    }

    return (
        <motion.div 
            className='sites'
            variants={container}
            initial="hidden"
            animate="show"
        >
            { error && <p className='sites__error'>{error}</p>}

            {
                sites.map(site => (
                    <Site 
                        key={site._id} 
                        site={site}
                        error={error}
                        setError={setError}
                        setLoading={setLoading}
                    ></Site>
                ))
            }

             
                <div 
                    className='sites__btns'
                    style={ currentPage * 3 === 3 ? { alignSelf: 'flex-end' } : {}}
                >
                    {
                        currentPage !== 1 &&
                            <button 
                                className="sites__btns--previous"
                                onClick={() => {
                                    if(currentPage * 3 <= maxNumOfSites) {
                                        getNextSites((currentPage - 2) * 3); 
                                        setCurrentPage(currentPage - 1);
                                    } else {
                                        getNextSites((currentPage - 2) * 3); 
                                        setCurrentPage(currentPage - 1);
                                    }
                                }}
                            ><span className='sites__btns--previous--icon'><FaAngleDoubleLeft/></span>View Previous</button>
                    }
                    {
                        currentPage !== maxPages &&
                        <button 
                            className="sites__btns--next"
                            onClick={() => {
                                if(currentPage * 3 <= maxNumOfSites) {
                                    getNextSites(currentPage * 3);
                                    setCurrentPage(currentPage + 1);
                                }
                            }}
                        >View Next<span className='sites__btns--next--icon'><FaAngleDoubleRight/></span></button>
                    }
                </div>
        </motion.div>
    )
}

export default Sites;