import React, { useState, useEffect } from 'react';
//  the Modal component accepts a close prop which is passed a default value of an empty function () => {}. This ensures that the component will not throw an error when the prop is not passed.

const Modal = ({ open, theme, duration, children }) => {
  const [showModal, setShowModal] = useState(open);
  const handleKeydown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13 || e.keyCode === 32) {
      handleClose();
    }
  };
  useEffect(() => {
    if (open) {
      setShowModal(true);
      window.addEventListener('keydown', handleKeydown);

      if (duration) {
        console.log('yes duration');
        setTimeout(() => {
          handleClose();
        }, duration);
      }
    }
  }, [open]);

  const handleClose = () => {
    setTimeout(() => {
      setShowModal(false);
      window.removeEventListener('keydown', handleKeydown);
    }, 300);
  };

  return (
    <>
      {/* {!open && <button onClick={() => setShowModal(true)}>Open Modal</button>} */}
      <div className={`modal ${showModal ? 'open' : 'closed'}`}>
        <div className={'modal-content ' + theme}>
          {!duration && (
            <button className='modal-close' onClick={handleClose}>
              <i className='fa-regular fa-circle-xmark'></i>
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
