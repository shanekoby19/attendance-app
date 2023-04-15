import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const  Dropzone = ({ file, setFile }) => {
    const onDrop = useCallback(acceptedFiles => {
      setFile(acceptedFiles[0]);
    }, [setFile])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
    return (
      <div 
          {...getRootProps()}
          style={{ 
              height: "10rem",
              border: "2px solid black",
              borderRadius: "0.6rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "64%",
              marginTop: "2rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)"
          }}
      >
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p style={{ color: "green" }}>Good to drop...</p> :
            file ?
            <p style={{ color: "green" }}>{file.path}</p> :
            <p style={{ color: "black" }}>Drag and drop a profile photo here.</p>
        }
      </div>
    )
}

export default Dropzone;