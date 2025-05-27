// src/pages/ShipsPage.jsx
import React from 'react';
import { useShips } from '@/contexts/ShipsContext';
// import ShipList from '@/components/Ships/ShipList'; // Uncomment when ready
// import ShipForm from '@/components/Ships/ShipForm'; // Uncomment when ready

function ShipsPage() {
  const { ships, loadingShips, addShip, editShip, deleteShip } = useShips();

  if (loadingShips) {
    return <div>Loading ships...</div>;
  }

  // Dummy functions for form actions (will be fleshed out)
  const handleAddShip = (newShipData) => {
    addShip(newShipData);
    alert('Ship added (simulated)!');
  };

  const handleEditShip = (id, updatedData) => {
    editShip(id, updatedData);
    alert('Ship updated (simulated)!');
  };

  const handleDeleteShip = (id) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      deleteShip(id);
      alert('Ship deleted (simulated)!');
    }
  };

  return (
    <div className="ships-page-container">
      <div className="main-content-header">
        <h1>Ships Management</h1>
        {/* You can add a button here to open a modal/form for adding a new ship */}
        <button onClick={() => alert('Open add ship form')}>Add New Ship</button>
      </div>

      <div className="card">
        <h3>Existing Ships</h3>
        {/* <ShipList ships={ships} onEdit={handleEditShip} onDelete={handleDeleteShip} /> */}
        {/* Temporary list without ShipList component */}
        {ships.length === 0 ? (
          <p>No ships found. Add one!</p>
        ) : (
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
              {ships.map(ship => (
                <tr key={ship.id}>
                  <td>{ship.name}</td>
                  <td>{ship.imo}</td>
                  <td>{ship.flag}</td>
                  <td>{ship.status}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => alert(`View ${ship.name}`)}>View</button>
                    <button className="btn-secondary" onClick={() => alert(`Edit ${ship.name}`)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDeleteShip(ship.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* <div className="card">
        <h3>Add/Edit Ship</h3>
        <ShipForm onSubmit={handleAddShip} />
      </div> */}
    </div>
  );
}

export default ShipsPage;