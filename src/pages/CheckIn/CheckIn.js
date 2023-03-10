import Sites from './components/Sites';
import LocationForm from './components/LocationForm';
import Map from './components/Map';
import { useSites } from '../../context/DataContext';

import './CheckIn.scss';

const CheckIn = () => {
    const sites = useSites();
    const mapIsExpanded = sites.length === 0;
    console.log(mapIsExpanded);

    return (
        <div className='checkIn'>
            <section style={mapIsExpanded ? { width: "30%" } : { width: "50%" }}>
                <LocationForm style={mapIsExpanded ? { width: "100%"} : { width: "60%"} }></LocationForm>
                <Sites></Sites>
            </section>
            <section style={mapIsExpanded ? { height: "90vh", width: "70%" } : { height: "90vh", width: "50%" }}>
                <Map></Map>
            </section>
        </div>
    )
}

export default CheckIn;