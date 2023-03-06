import { usePlacesWidget } from "react-google-autocomplete";
import { useRef, useState } from 'react';

const LocationForm = () => {
    const cityRef = useRef('');
    const stateRef = useRef('');
    const zipRef = useRef('');
    const [coordsObj, setCoordsObj] = useState({ type: 'Point' });
    
    // REGENERATE & REPLACE API KEY FOR SECURE ACCESS
    const { ref: addressRef } = usePlacesWidget({
        apiKey: "AIzaSyAS8PkfSCcwoYlt3nowEQKjMMnLzcXJW6w",
        options: {
            types: ['address']
        },
        onPlaceSelected : (place) => {
            fillAddressComponents(place.address_components);

            // Get the longitude and latitude functions from the places obj.
            const { lng, lat } = place.geometry.location;
            setCoordsObj({ ...coordsObj,  coords: [lng(), lat()]})
        }
    });

    // Fill out each address component when a place is selected.
    const fillAddressComponents = (addressComponents) => {
        // Find the street number and address values and set them in the form.
        const streetNumber = addressComponents.find(addressComponent => {
            return addressComponent.types.includes('street_number')
        }).long_name;

        const streetAddress = addressComponents.find(addressComponent => {
            return addressComponent.types.includes('route')
        }).long_name;

        addressRef.current.value = `${streetNumber} ${streetAddress}`

        // Find the city name and set it in the form field.
        const city = addressComponents.find(addressComponent => {
            return addressComponent.types.includes('locality')
        }).long_name;

        cityRef.current.value = city;

        // Find the state name and set it in the form field.
        const state = addressComponents.find(addressComponent => {
            return addressComponent.types.includes('administrative_area_level_1')
        }).short_name;

        stateRef.current.value = state;

        // Find the zip code and set it in the form field.
        const zip = addressComponents.find(addressComponent => {
            return addressComponent.types.includes('postal_code')
        }).short_name;

        zipRef.current.value = zip;

    }

    return (
        <div className='location__form'>

            <div className='location__form--group'>
                <label className='location__form--label'>Street Address:</label>
                <input className='location__form--input' ref={addressRef} autoComplete="new-password"></input>
            </div>

            <div className='location__form--group'>
                <label className='location__form--label'>City:</label>
                <input className='location__form--input' ref={cityRef} autoComplete="new-password"></input>
            </div>

            <div className='location__form--group'>
                <label className='location__form--label'>State:</label>
                <input className='location__form--input' ref={stateRef} autoComplete="new-password"></input>
            </div>    
            
            <div className='location__form--group'>
                <label className='location__form--label'>Zip:</label>
                <input className='location__form--input' ref={zipRef} autoComplete="new-password"></input>
            </div>
        </div>
    )
}

export default LocationForm;