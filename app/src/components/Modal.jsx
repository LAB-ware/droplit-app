import Modal from 'react-modal';

// Initialize the modal
Modal.setAppElement('#root');

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          maxWidth: '80%',
          margin: 'auto',
        },
      }}
    >
      <button onClick={onClose} className='close-button'>
        Close
      </button>
      <h2>Nice!</h2>
      <img src={imageUrl} alt='Image' />
    </Modal>
  );
};

export default ImageModal;
