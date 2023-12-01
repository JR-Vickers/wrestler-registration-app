import React, { useState } from 'react';

function WrestlerForm() {
  const [formData, setFormData] = useState({
    wrestlerName: '',
    teamId: '',
    classId: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/add-wrestler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wrestlerName: formData.wrestlerName,
          teamId: parseInt(formData.teamId),  // Ensure this is an integer
          classId: parseInt(formData.classId)  // Ensure this is an integer
        })
      });

      if (response.ok) {
        // If the response is OK, you can clear the form and/or display a success message
        console.log('Wrestler added successfully');
        setFormData({ wrestlerName: '', teamId: '', classId: '' });
      } else {
        // If the server response is not OK, handle errors (e.g., display an error message)
        console.error('Failed to add wrestler');
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

// TODO: replace some text boxes with dropdown menus, where appropriate
// TODO: make sure that users can only input correct character types
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="wrestlerName"
        value={formData.wrestlerName}
        onChange={handleChange}
        placeholder="Wrestler Name"
      />
      <br/>
      <input
        type="text"
        name="teamId"
        value={formData.teamId}
        onChange={handleChange}
        placeholder="Team ID"
      />
      <br/>
      <input
        type="text"
        name="classId"
        value={formData.classId}
        onChange={handleChange}
        placeholder="Class ID"
      />
      <br/>
      <button type="submit">Register Wrestler</button>
    </form>
  );
}

export default WrestlerForm;