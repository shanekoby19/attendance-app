import { useState, useContext, createContext } from 'react';

const useStore = () => {
    const [coords, setCoords] = useState({
        type: 'Point',
        coordinates: []
    });
    const [sites, setSites] = useState([]);

    return {
        sites,
        coords,
        updateSites: (sites) => setSites(sites),
        updateCoords: (coords) => setCoords(coords),
    }
}

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => (
    <DataContext.Provider value={useStore()}>
        {children}
    </DataContext.Provider>
)

export const useSites = () => useContext(DataContext).sites;
export const useCoords = () => useContext(DataContext).coords;
export const useUpdateSites = () => useContext(DataContext).updateSites;
export const useUpdateCoords = () => useContext(DataContext).updateCoords;
