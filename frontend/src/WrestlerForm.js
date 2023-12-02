import React, { useState, useEffect } from 'react';
import './App.css';

function WrestlerForm({ onAddWrestler }) {
  const [formData, setFormData] = useState({
    wrestlerName: '',
    teamId: '',
    classId: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [weightClasses, setWeightClasses] = useState([]);

  useEffect(() => {
    const fetchWeightClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/weight-classes');
        if (response.ok) {
          const data = await response.json();
          setWeightClasses(data);
        } else {
          console.error('Failed to fetch weight classes');
        }
      } catch (error) {
        console.error('Error fetching weight classes:', error)
      }
    };

    fetchWeightClasses();
  }, []);
  
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
        setErrorMessage('');
        if (onAddWrestler) {
          onAddWrestler();
        }
      } else {
        // If the server response is not OK, handle errors (e.g., display an error message)
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      setErrorMessage('Error: ${error.message}');
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-input"
        type="text"
        name="wrestlerName"
        value={formData.wrestlerName}
        onChange={handleChange}
        placeholder="Wrestler Name"
      />
      <br/>
      <input
        className="form-input"
        type="number"
        name="teamId"
        value={formData.teamId}
        onChange={handleChange}
        placeholder="Team ID"
      />
      <br/>
      <select
        className="form-input"
        name="classId"
        value={formData.classId}
        onChange={handleChange}
      >
        <option value="">Select Weight Class</option>
        {weightClasses.map((weightClass) => (
          <option key={weightClass.class_id} value={weightClass.class_id}>
            {weightClass.class_name}
          </option>
        ))}
      </select>
      <br/>
      <button type="submit">Register Wrestler</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Display error message */}
    </form>
  );
}

export default WrestlerForm;