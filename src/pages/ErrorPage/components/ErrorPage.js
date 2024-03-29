import '../styles/ErrorPage.scss';

const ErrorPage = ({ message, status }) => {
    return (
        <div className='error__page'>
            <div
                style={{
                    position: "relative",
                    width: "40%"
                }}
            >
                <img
                    className='error__page__image'
                    src='./images/error.jpg'
                    alt="People experiencing an error"
                ></img>
                <a href="https://www.freepik.com/free-vector/tiny-people-examining-operating-system-error-warning-web-page-isolated-flat-illustration_11235921.htm#query=error&position=0&from_view=search&track=sph"
                    style={{
                        position: "absolute",
                        color: "black",
                        top: 0,
                        left: 0,
                    }}
                >Image by pch.vector</a>
            </div>

            <div className='error__page__content'>
                <h1 className='error__page__content--status'>{status} ERROR:</h1>
                <h2 className='error__page__content--message'>{message}</h2>
            </div>
        </div>
    )
}

export default ErrorPage;