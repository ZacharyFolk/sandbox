import React, { useState } from 'react';
import axios from 'axios';
import { SocialIcon } from 'react-social-icons';
import Modal2 from '../../utils/Modal';
import './contact.css';
function ContactForm() {
  const fp = './images/folkphotography.jpg';
  const arto = './images/arto.jpg';
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  function handleModalOpen(content) {
    setModalContent(content);
    setOpenModal(true);
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
  };
  const handleSubmit = async (event) => {
    console.log(errors);

    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:9999/api/email/send/',
        formData
      );
      resetForm();
    } catch (err) {
      console.log(err);
      console.log(err.response.status);
      console.log(err.response.data.errors);
      if (err.response.status === 422) {
        console.log('this should go yea?');
        console.log(err.response.data.errors);

        setErrors(err.response.data.errors);
        console.log(errors[0].msg);
      }
    }
  };

  const aboutFolk = () => {
    return (
      <div>
        <h2 className='site-title'>folkphotography.com </h2>
        <p>A website feaeturing my photography from over the decades.</p>
        <a href='https://folkphotography.com' target='_blank' rel='noreferrer'>
          Check it out &lt; &lt;
        </a>
      </div>
    );
  };

  const aboutArto = () => {
    return (
      <div>
        <h2 className='site-title'>artological.com </h2>
        <p>An ecommerce website selling fine art prints.</p>
        <a href='https://artological.com' target='_blank' rel='noreferrer'>
          Check it out &lt; &lt;
        </a>
      </div>
    );
  };

  const empty = (z) => {
    if (z) {
      let v = document.getElementById(z).value;
      if (v == '') {
        return false;
      }
    }
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
              <img src={arto} alt='Print shop' />
            </div>
          </div>

          <div className='social-container'>
            <SocialIcon
              bgColor='#5bf870'
              target={'_blank'}
              url='https://www.linkedin.com/in/zacharyfolk/'
            />
            <SocialIcon
              bgColor='#5bf870'
              target={'_blank'}
              url='https://www.instagram.com/zachary_folk/'
            />
            <SocialIcon
              bgColor='#5bf870'
              target={'_blank'}
              url='https://github.com/ZacharyFolk'
            />
            <SocialIcon
              title='Folk Photography on Facebook'
              target={'_blank'}
              bgColor='#5bf870'
              url='https://www.facebook.com/zacharyfolkphotography/'
            />
            <SocialIcon
              bgColor='#5bf870'
              target={'_blank'}
              url='https://twitter.com/FolkPhotograph1'
            />
            <SocialIcon
              bgColor='#5bf870'
              target={'_blank'}
              url='https://stackoverflow.com/users/82330/zac'
            />
          </div>
        </div>
        <div className='col col-2 flex-centered'>
          <div className='contact-container'>
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
                {errors[0].param === 'email' && (
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
                {errors[0].param === 'email' && (
                  <span className='error-message'>{errors[0].msg}</span>
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
            </form>
          </div>
        </div>
      </div>
      <Modal2 content={modalContent} onClose={handleModalClose} />
    </div>
  );
}

export default ContactForm;
