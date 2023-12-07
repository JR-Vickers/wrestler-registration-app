import React, { useState, useEffect } from 'react';
import './styles.css';

function WrestlerForm({ onAddWrestler }) {
  const [formData, setFormData] = useState({
    wrestlerName: '',
    teamName: '',
    classId: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [weightClasses, setWeightClasses] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch weight classes
        const weightClassesResponse = await fetch('http://localhost:5000/weight-classes');
        const teamsResponse = await fetch('http://localhost:5000/teams');

        if (weightClassesResponse.ok && teamsResponse.ok) {
          const weightClassesData = await weightClassesResponse.json();
          const teamsData = await teamsResponse.json();

          setWeightClasses(weightClassesData);
          setTeams(teamsData);
        } else {
          console.error('Failed to fetch dropdown data');
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
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
          // Make sure to send teamId instead of teamName, as the backend expects an ID
          teamId: teams.find(t => t.team_name === formData.teamName)?.team_id,
          classId: parseInt(formData.classId),
        }),
      });
  
      if (!response.ok) {
        // Try to parse the response as JSON, but account for the possibility it's not JSON
        let errorData = { message: response.statusText }; // Default error message
        try {
          errorData = await response.json(); // Attempt to parse JSON
        } catch (jsonError) {
          console.error('Response not in JSON format:', jsonError);
        }
        setErrorMessage(errorData.message);
        return;
      }
  
      console.log('Wrestler added successfully');
      setFormData({ wrestlerName: '', teamName: '', classId: '' });
      setErrorMessage('');
      if (onAddWrestler) {
        onAddWrestler();
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage(`Error: ${error.message}`);
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

      {/* Dropdown for selecting team by name */}
      <select
        className="form-input"
        name="teamName"
        value={formData.teamName}
        onChange={handleChange}
      >
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.team_id} value={team.team_name}>
            {team.team_name}
          </option>
        ))}
      </select>
      <br/>

      {/* Dropdown for selecting weight class */}
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
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </form>
  );
}

export default WrestlerForm;
