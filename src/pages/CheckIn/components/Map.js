import { 
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup
} from "react-leaflet";
import * as L from 'leaflet';
import { useCoords, useSites } from '../../../context/DataContext';

import '../styles/Map.scss';


const Map = () => {
    const coords = useCoords();
    const sites = useSites();
    const center = coords.coordinates.length !== 0 ? [coords.coordinates[1], coords.coordinates[0]]: [36.1716, -115.1391];
    
    const LeafletIcon = L.Icon.extend({
        options: {
            
        }
    });

    const currentLocationMarker = new LeafletIcon({
        iconUrl: 'images/current_location_marker.svg'
    })

    const successMarker = new LeafletIcon({
        iconUrl: 'images/success_marker.svg'
    })

    const failureMarker = new LeafletIcon({
        iconUrl: 'images/failure_marker.svg'
    })

    const ChangeView = () => {
        const map = useMap();
        map.flyTo(center, 14);
        return null;
    }

    return(
        <MapContainer className='map' center={center} zoom={12}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { 
                coords.coordinates.length > 0 && 
                <Marker 
                    key="current_location_marker" 
                    position={[coords.coordinates[1], coords.coordinates[0]]}
                    icon={currentLocationMarker}
                >
                    <Popup>
                        {"You are here."} <br />
                    </Popup>
                </Marker>
            }
            {
                sites.map(site => {
                    const coords = site.location.coords.coordinates;
                    const addressLine2 = `${site.location.city}, ${site.location.state} ${site.location.zip}`;

                    return (
                        <Marker 
                            key={site._id} 
                            position={[coords[1], coords[0]]}
                            icon={site.distance.feet <= 1000 ? successMarker : failureMarker}
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