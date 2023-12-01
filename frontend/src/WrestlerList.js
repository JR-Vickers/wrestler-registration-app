import React, { useState, useEffect } from 'react';

function WrestlerList() {
  const [wrestlers, setWrestlers] = useState([]);

  useEffect(() => {
    // Function to fetch wrestler data
    const fetchWrestlers = async () => {
      try {
        const response = await fetch('http://localhost:5000/wrestlers');
        if (response.ok) {
          const data = await response.json();
          setWrestlers(data);
        } else {
          console.error('Failed to fetch wrestlers');
        }
      } catch (error) {
        console.error('Error fetching wrestlers:', error);
      }
    };

    fetchWrestlers();
  }, []); // The empty array ensures this effect runs once on component mount

  return (
    <div>
      <h2>Wrestlers List</h2>
      <ul>
        {wrestlers.map((wrestler) => (
          <li key={wrestler.wrestler_id}>
            {wrestler.wrestler_name} - Team ID: {wrestler.team_id} - Class ID: {wrestler.class_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WrestlerList;
