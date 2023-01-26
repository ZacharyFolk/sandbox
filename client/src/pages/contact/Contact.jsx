import React, { useState } from 'react';
import axios from 'axios';
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({});
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formData to your server here
    console.log(formData);

    axios({
      method: 'POST',
      url: 'http://localhost:9999/api/email/send/',
      data: formData,
    }).then((response) => {
      if (response.data.status === 'success') {
        alert('Message Sent.');
        resetForm();
      } else if (response.data.status === 'fail') {
        alert('Message failed to send.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Message:
        <textarea
          name='message'
          value={formData.message}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type='submit'>Submit</button>
    </form>
  );
}

export default ContactForm;
