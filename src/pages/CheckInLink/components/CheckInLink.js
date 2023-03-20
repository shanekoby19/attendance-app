

import '../styles/CheckInLink.scss';

const CheckInLink = () => {

    return (
        <div className='checkInLink'>
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?data="http://localhost:3001/checkin/link/auth"&size=200x200`} 
                alt="a qr code to login your child."></img>
        </div>
    )
}

export default CheckInLink;

