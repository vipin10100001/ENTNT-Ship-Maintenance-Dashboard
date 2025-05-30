// src/pages/ShipsPage.jsx
import React, { useState } from 'react';
import { useShips } from '@/contexts/ShipsContext';
import { useAuth } from '@/contexts/AuthContext'; // To check user roles
import ShipForm from '@/components/Ships/ShipForm'; // Import the ShipForm component
import { useNavigate } from 'react-router-dom'; // For navigating to ship detail

function ShipsPage() {
  const { ships, loading, error, deleteShip } = useShips(); // Get deleteShip function
  const { currentUser, hasRole } = useAuth(); // Get currentUser and hasRole
  const navigate = useNavigate();

  const [showShipForm, setShowShipForm] = useState(false);
  const [shipToEdit, setShipToEdit] = useState(null); // State to hold ship being edited

  const handleAddShipClick = () => {
    setShipToEdit(null); // Clear any ship being edited
    setShowShipForm(true);
  };

  const handleEditShip = (ship) => {
    setShipToEdit(ship); // Set the ship to be edited
    setShowShipForm(true);
  };

  const handleDeleteShip = async (shipId, shipName) => {
    if (window.confirm(`Are you sure you want to delete ship "${shipName}"? This action cannot be undone.`)) {
      try {
        await deleteShip(shipId);
        alert(`Ship "${shipName}" deleted successfully!`);
      } catch (err) {
        alert(`Failed to delete ship "${shipName}". Error: ${err.message}`);
      }
    }
  };

  const handleCloseForm = () => {
    setShowShipForm(false);
    setShipToEdit(null); // Clear shipToEdit when form closes
  };

  if (loading) return <div className="loading-fullscreen">Loading ships...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="ships-page">
      <div className="main-content-header">
        <h1>Ships Management</h1>
        {hasRole(['Admin', 'Inspector']) && ( // Only Admins and Inspectors can add/edit/delete ships
          <button onClick={handleAddShipClick}>Add New Ship</button>
        )}
      </div>

      {showShipForm && (
        <ShipForm shipToEdit={shipToEdit} onClose={handleCloseForm} />
      )}

      {!showShipForm && ( // Only show list if form is not active
        <div className="card">
          {ships.length > 0 ? (
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
                    <td onClick={() => navigate(`/ships/${ship.id}`)} style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                      {ship.name}
                    </td>
                    <td>{ship.imo}</td>
                    <td>{ship.flag}</td>
                    <td>{ship.status}</td>
                    <td>
                      {hasRole(['Admin', 'Inspector']) && (
                        <>
                          <button onClick={() => handleEditShip(ship)} className="btn-secondary" style={{ marginRight: '10px' }}>Edit</button>
                          <button onClick={() => handleDeleteShip(ship.id, ship.name)} className="btn-danger">Delete</button>
                        </>
                      )}
                      {!hasRole(['Admin', 'Inspector']) && ( // For Engineers or other roles, only view
                         <button onClick={() => navigate(`/ships/${ship.id}`)} className="btn-secondary">View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No ships registered yet. {hasRole(['Admin', 'Inspector']) && 'Click "Add New Ship" to get started.'}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ShipsPage;