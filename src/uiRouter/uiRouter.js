import { 
    createBrowserRouter,
    useRouteError,
    isRouteErrorResponse
} from 'react-router-dom';
import axios from 'axios';

import Error from '../pages/Error/components/Error';
import Login from '../pages/Login/components/Login';
import CheckIn from '../pages/CheckIn/CheckIn';
import CheckInLink from '../pages/CheckInLink/components/CheckInLink';


const UIRouter = () => {
    
    const isAuthenticated = async () => {
        try {
            await axios.get('http://localhost:3000/api/v1/auth/login', { withCredentials: true });
            return true;
        } catch(err) {
            const { message } = err.response.data;
            throw new Response(message, { status: err.response.status })
        }
    }

    return createBrowserRouter([
        {
            path: '/',
            index: true,
            element: <Login />,
        },
        {
            path: '/checkin',
            index: true,
            loader: async () => {
                await isAuthenticated();
                try {
                    const res = await axios.get('http://localhost:3000/api/v1/keys', { withCredentials: true });
                    const apiKeys = {};
                    res.data.data.keys.forEach(key => apiKeys[key.name] = key.key)

                    const res2 = await axios.get('http://localhost:3000/api/v1/sites', { withCredentials: true });
                    const maxNumOfSites = res2.data.data.nearbySites.length;
                    return {
                        apiKeys,
                        maxNumOfSites,
                    };
                }
                catch(err) {
                    const { message } = err.response.data;
                    throw new Response(message, { status: err.response.status })
                }
            },
            element: <CheckIn />,
            errorElement: <ErrorBoundary />
        },
        {
            path: '/checkin/link',
            loader: async () => {
                await isAuthenticated();
                return {}
            },
            element: <CheckInLink />,
            errorElement: <ErrorBoundary />
        }
    ])
}

const ErrorBoundary = () => {
    const error = useRouteError();
  
    if (isRouteErrorResponse(error) && error.status === 401) {
      // the response json is automatically parsed to
      // `error.data`, you also have access to the status
      return <Error message={error.data} status={error.status} />
    }
}

export default UIRouter();