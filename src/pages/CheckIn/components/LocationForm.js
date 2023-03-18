import { usePlacesWidget } from "react-google-autocomplete";
import { useRef } from 'react';
import axios from 'axios';

import { useCoords, useUpdateCoords, useUpdateSites } from '../../../context/DataContext';

import '../styles/LocationForm.scss';

const LocationForm = ({ mapIsExpanded, apiKeys, setError, setLoading }) => {
    const cityRef = useRef('');
    const stateRef = useRef('');
    const zipRef = useRef('');
    const coords = useCoords();
    const updateCoords = useUpdateCoords();
    const updateSites = useUpdateSites();


    const getSites = async (lng, lat) => {
        updateCoords({...coords, coordinates: [lng, lat]})

        axios
            .get(`http://localhost:3000/api/v1/sites?lng=${lng}&lat=${lat}&limit=3`)
            .then(response => updateSites(response.data.data.nearbySites));
    }

    const useCurrentLocation = () => {
        setError('');
        setLoading(true);
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            updateCoords(coords.latitude, coords.longitude);
            getSites(coords.longitude, coords.latitude);
            setLoading(false);
        }, ({ code }) => {
            // Code 1 = 'Permissions Denied'
            if(code === 1) {
                setError('Sorry, it looks like you block location services on this computer. Please turn them on to continue.');
            }
            // Code 2 = 'Location Unavailable'
            if(code === 2) {
                setError('Internal error, please try again later.');
            }
            // Code 3 = 'Timeout'
            if(code === 3) {
                setError('Whoops, it looks like getting your location is taking longer than expected. Please try again later.')
            }
            setLoading(false);
        }, {
            timeout: 10000 // 10 seconds
        });

    }
    
    // REGENERATE & REPLACE API KEY FOR SECURE ACCESS
    const { ref: addressRef } = usePlacesWidget({
        apiKey: apiKeys['GOOGLE_API_KEY'],
        options: {
            types: ['address']
        },
        onPlaceSelected : (place) => {
            console.log(place);
            setError('');
            fillAddressComponents(place.address_components);

            // Get the longitude and latitude functions from the places obj.
            const { lng, lat } = place.geometry.location;
            getSites(lng(), lat());
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
        <div
            className='location__form'
            style={{ width: mapIsExpanded ? "100%" : "50%" }}
        >

            <h1 className='primary__heading'>Check-In</h1>

            <div className='location__form--group'>
                <label className='location__form--label'>Street Address:</label>
                <input className='location__form--input' ref={addressRef} autoComplete="new-password"></input>
            </div>

            <div className='location__form--group'>
                <label className='location__form--label'>City:</label>
                <input className='location__form--input' ref={cityRef} autoComplete="new-password"></input>
            </div>

            <div className='location__form--group--horizontal'>
                <div className='location__form--group--horizontal--embedded'>
                    <label className='location__form--label'>State:</label>
                    <input className='location__form--input location__form__state__input' ref={stateRef} autoComplete="new-password"></input>
                </div>
                <div className='location__form--group--horizontal--embedded'>
                    <label className='location__form--label'>Zip:</label>
                    <input className='location__form--input location__form__zip__input' ref={zipRef} autoComplete="new-password"></input>
                </div>
            </div>    
            
            <div style={{display: "flex"}}>
                <div className='location__form--group--horizontal--embedded'>
                    <button 
                        className='primary__button'
                        onClick={getSites}
                    >Search</button>
                </div>
                <div className='location__form--group--horizontal--embedded'>
                    <button 
                        className='secondary__button'
                        onClick={useCurrentLocation}>Use Current Location</button>
                </div>
            </div>
        </div>
    )
}

export default LocationForm;