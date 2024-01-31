import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../utils/Modal';
import Social from '../../components/social/Social';
import './contact.css';
function ContactForm() {
  const fp = './images/folkphotography.jpg';
  const arto = './images/arto.jpg';
  const fp1 = './images/fp1.jpg';
  const fp2 = './images/fp2.jpg';
  const fp3 = './images/fp3.jpg';
  const arto1 = './images/arto1.jpg';
  const arto2 = './images/arto2.jpg';
  const arto3 = './images/arto3.jpg';

  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const displayErrors = (errors) => {
    return errors.map((error, index) => {
      return (
        <span key={index} className='error-message'>
          {error.msg}
        </span>
      );
    });
  };
  function handleModalOpen(content) {
    setOpenModal(true);
    setModalContent(content);
  }

  function handleModalClose() {
    setModalContent(null);
    setOpenModal(false);
  }

  const isDisabled = !(formData.name && formData.email && formData.message);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:9999/api/email/send/',
        formData
      );
      setFormSubmitted(true);
      resetForm();
    } catch (err) {
      if (err.response.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const aboutFolk = () => {
    return (
      <div>
        <h2 className='site-title'>folkphotography.com </h2>
        <p>A website featuring my photography from over the decades.</p>
        <div className='web-thumbs'>
          <img src={fp1} alt='' />
          <img src={fp2} alt='' />
          <img src={fp3} alt='' />
        </div>
        <a
          className='web-link'
          href='https://folkphotography.com'
          target='_blank'
          rel='noreferrer'
        >
          Check it out &gt; &gt;
        </a>
      </div>
    );
  };

  const aboutArto = () => {
    return (
      <div>
        <h2 className='site-title'>artological.com </h2>
        <p>An ecommerce website selling fine art prints.</p>
        <div className='web-thumbs'>
          <img src={arto1} alt='' />
          <img src={arto2} alt='' />
          <img src={arto3} alt='' />
        </div>
        <a
          className='web-link'
          href='https://artological.com'
          target='_blank'
          rel='noreferrer'
        >
          Check it out &gt; &gt;
        </a>
      </div>
    );
  };

  return (
    <div className='container'>
      <div className='row bump-top'>
        <div className='col col-2'>
          <p>
            If you are interested in working together, have a suggestion, or
            just want to say hello, you can use this form to send me an email.
          </p>

          <p>My other websites:</p>
          <div className='websites'>
            <div>
              <img
                src={fp}
                alt='Photography website of Zachary Folk'
                onClick={() => {
                  handleModalOpen(aboutFolk);
                }}
              />
            </div>
            <div>
              <img
                src={arto}
                alt='Print shop'
                onClick={() => {
                  handleModalOpen(aboutArto);
                }}
              />
            </div>
          </div>
          <Social />
        </div>
        <div className='col col-2 flex-centered'>
          <div className='contact-container'>
            {formSubmitted ? (
              <p>Thank you for your message!</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <legend>Send me a message!</legend>
                <fieldset>
                  <input
                    id='name'
                    placeholder='Your name'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <span className='error-message'>{errors.name}</span>
                  )}
                </fieldset>
                <fieldset>
                  <input
                    id='email'
                    placeholder='Your Email Address'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <span className='error-message'>{errors.email}</span>
                  )}
                </fieldset>
                <fieldset>
                  <textarea
                    id='msg'
                    placeholder='Type your message here'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  {errors.message && (
                    <span className='error-message'>{errors.message}</span>
                  )}
                </fieldset>
                <button type='submit' disabled={isDisabled}>
                  Submit
                </button>
                {errors.length > 0 && (
                  <div className='error-container'>{displayErrors(errors)}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      {openModal && (
        <Modal open={true} onClose={handleModalClose}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}

export default ContactForm;
