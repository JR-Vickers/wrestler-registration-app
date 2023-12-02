import React, { useState, useEffect } from 'react';

function WrestlerList({ wrestlers }) {
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