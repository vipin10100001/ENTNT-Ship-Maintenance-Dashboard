
// Displays a list of components, often used within ShipDetail. [cite: 8]
import React from 'react';

function ComponentList({ components, onEdit, onDelete }) {
  if (!components || components.length === 0) {
    return <p>No components found.</p>;
  }

  return (
    <div className="component-list-container">
      <h4>Components</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Serial Number</th>
            <th>Installation Date</th>
            <th>Last Maintenance Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id}>
              <td>{component.name}</td>
              <td>{component.serialNumber}</td>
              <td>{component.installDate}</td>
              <td>{component.lastMaintenanceDate}</td>
              <td>
                <button onClick={() => onEdit(component)}>Edit</button>
                <button onClick={() => onDelete(component.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComponentList;