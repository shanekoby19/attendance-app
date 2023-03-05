

const Site = ({ site }) => {
    const distance = site.distance.feet <= 500 ? `${site.distance.feet}ft` : `${site.distance.miles}mi`;
    const within1000feet = site.distance.feet <= 500;

    return (
        <div className='site'>
            <h2>{site.site}</h2>
            <div className="site__address">
                <h3>{site.location.address}</h3>
                <h4>{`${site.location.city}, ${site.location.state} ${site.location.zip}`}</h4>
            </div>
            <button
                disabled={!within1000feet}
            >Check-In</button>
            <h4>{distance}</h4>
        </div>
    )
}

export default Site;