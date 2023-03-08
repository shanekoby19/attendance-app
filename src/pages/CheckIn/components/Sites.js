import Site from './Site';
import { useSites } from '../../../context/DataContext'

const Sites = () => {
    const sites = useSites();

    return (
        <div className='sites'>
            {sites.map(site => (
                <Site key={site._id} site={site}></Site>
            ))}
        </div>
    )
}

export default Sites;