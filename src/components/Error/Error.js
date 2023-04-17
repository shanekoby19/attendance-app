import './styles/Error.scss'

const Error = ({ message, style }) => {
    return ( 
        <div 
            className='error'
            style={style}
        >
            <p className='error__message'>{message || "Something went wrong."}</p>
        </div>
    )
}

export default Error;