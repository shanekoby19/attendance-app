import { DataContextProvider } from '../context/DataContext';
import { AuthContextProvider } from '../context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import UIRouter from '../uiRouter/uiRouter';

import './App.scss';

const App = () => {    
    return (
        <AuthContextProvider>
            <DataContextProvider>
                <RouterProvider router={UIRouter}>
                    <div 
                        className='App'
                        style={{ maxHeight: "100vh" }}>
                    </div>
                </RouterProvider>
            </DataContextProvider>
        </AuthContextProvider>
    )
}

export default App;