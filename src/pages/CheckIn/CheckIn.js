import Sites from './components/Sites';
import LocationForm from './components/LocationForm';
import Map from './components/Map';

import './CheckIn.scss';

const CheckIn = () => {
    return (
        <div className='checkIn'>
            <section style={{ width: "50%" }}>
                <LocationForm></LocationForm>
                <Sites></Sites>
            </section>
            <section style={{ height: "90vh", width: "50%" }}>
                <Map></Map>
            </section>
        </div>
    )
}

export default CheckIn;