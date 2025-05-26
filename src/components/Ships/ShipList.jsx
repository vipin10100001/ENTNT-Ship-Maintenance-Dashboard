// src/components/Ships/ShipList.jsx
// Displays a list of ships. [cite: 7]
import React from 'react';
import { Link } from 'react-router-dom';

function ShipList({ ships, onEdit, onDelete }) {
  if (!ships || ships.length === 0) {
    return <p>No ships found. Start by creating one!</p>;
  }

  return (
    <div className="ship-list-container">
      <h4>Registered Ships</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IMO Number</th>
            <th>Flag</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ships.map((ship) => (
            <tr key={ship.id}>
              <td>{ship.name}</td>
              <td>{ship.imo}</td>
              <td>{ship.flag}</td>
              <td>{ship.status}</td>
              <td>
                <Link to={`/ships/${ship.id}`}>View Details</Link>
                <button onClick={() => onEdit(ship)}>Edit</button>
                <button onClick={() => onDelete(ship.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShipList;