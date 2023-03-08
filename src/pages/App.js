import CheckIn from './CheckIn/CheckIn';
import { DataContextProvider } from '../context/DataContext';

import './App.scss';

const App = () => {
    return (
        <DataContextProvider>
            <div className='App'>
                <CheckIn />
            </div>
        </DataContextProvider>
    )
}

export default App;