import { useState, useEffect } from 'react';
import axios from 'axios';

import Site from './Site';

const Sites = () => {
    const [sites, setSites] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/v1/sites')
            .then(response => setSites(response.data));
    }, [])

    return (
        <div className='sites'>
            {sites.map(site => (
                <Site key={site._id} site={site}></Site>
            ))}
        </div>
    )
}

export default Sites;