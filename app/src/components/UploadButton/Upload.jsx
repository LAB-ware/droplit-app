import { React, useRef } from 'react';
import '../UploadButton/Upload.scss';

const Upload = () => {
  // REVISED
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded); // ADDED
  };

  const handleFile = () => {};

  return (
    <div>
      <button className='button-upload' onClick={handleClick}>
        Upload File
      </button>
      <input
        type='file'
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Upload;
