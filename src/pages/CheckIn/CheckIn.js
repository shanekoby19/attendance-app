import Sites from './components/Sites';
import LocationForm from './components/LocationForm';
import Map from './components/Map';

import './CheckIn.scss';

const CheckIn = () => {
    return (
        <div className='checkIn'>
            <section className='checkIn__data__entry'>
                <LocationForm></LocationForm>
                <Map></Map>
            </section>
            <section className='checkIn__sites'>
                <Sites></Sites>
            </section>
        </div>
    )
}

export default CheckIn;