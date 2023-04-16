import { Dna } from 'react-loader-spinner';

const Loader = ({ style, message }) => {
    return (
        <div
            style={style}
        >
            <Dna
                visible={true}
                height="150"
                width="150"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
            <p
                style={{
                    fontSize: "1rem",
                    fontWeight: 700
                }}
            >{ message }</p>
        </div>
    )
}

export default Loader;