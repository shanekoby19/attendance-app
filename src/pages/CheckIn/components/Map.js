import { 
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup
} from "react-leaflet";
import { useCoords, useSites } from '../../../context/DataContext';

import '../styles/Map.scss';


const Map = () => {
    const coords = useCoords();
    const sites = useSites();
    const center = coords.coordinates.length !== 0 ? [coords.coordinates[1], coords.coordinates[0]]: [36.1716, -115.1391];
    
    const ChangeView = () => {
        const map = useMap();
        map.flyTo(center, 11);
        return null;
    }

    return(
        <MapContainer className='map' center={center} zoom={12}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                sites.map(site => {
                    const coords = site.location.coords.coordinates;
                    const addressLine2 = `${site.location.city}, ${site.location.state} ${site.location.zip}`;

                    return (
                        <Marker 
                            key={site._id} 
                            position={[coords[1], coords[0]]}
                        >
                            <Popup>
                                {site.site} <br />
                                {site.location.address} <br />
                                {addressLine2} <br />
                                {`${site.distance.miles} mi`}
                            </Popup>
                        </Marker>
                    )
                })
            }
            <ChangeView/>
        </MapContainer>
    )
}

export default Map;