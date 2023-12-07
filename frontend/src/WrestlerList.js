import React, { useState, useEffect } from 'react';
import './styles.css'; // Make sure to import your custom stylesheet

const groupWrestlersByWeightClass = (wrestlers) => {
  return wrestlers.reduce((acc, wrestler) => {
    // If the weight class isn't a key in the accumulator, add it
    if (!acc[wrestler.class_name]) {
      acc[wrestler.class_name] = [];
    }

    // Push the current wrestler into the appropriate class array
    acc[wrestler.class_name].push(wrestler);

    return acc;
  }, {});
};

function WrestlerList({ wrestlers }) {
  return (
    <div className="wrestler-list">
      <h2 className="header">List of Competitors</h2>
      {Object.entries(groupWrestlersByWeightClass(wrestlers)).map(([className, wrestlersInClass]) => (
        <div key={className} className="class-group">
          <h3 className="class-title">{className}</h3>
          <table className="table-wrestlers">
            <tbody>
              {wrestlersInClass.map((wrestler) => (
                <tr key={wrestler.wrestler_id}>
                  <td className="wrestler-name">{wrestler.wrestler_name}</td>
                  <td className="team-name">{wrestler.team_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default WrestlerList;