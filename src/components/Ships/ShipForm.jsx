// src/components/Ships/ShipForm.jsx
import React, { useState, useEffect } from 'react';
import { useShips } from '@/contexts/ShipsContext'; // To use the addShip function
import { useNavigate } from 'react-router-dom'; // For navigation after submission

function ShipForm({ shipToEdit, onClose }) { // shipToEdit for edit mode, onClose to close form
  const [name, setName] = useState('');
  const [imo, setImo] = useState('');
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState('Active'); // Default status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { addShip, updateShip } = useShips(); // Get addShip and updateShip functions
  const navigate = useNavigate();

  // Populate form if in edit mode
  useEffect(() => {
    if (shipToEdit) {
      setName(shipToEdit.name || '');
      setImo(shipToEdit.imo || '');
      setFlag(shipToEdit.flag || '');
      setStatus(shipToEdit.status || 'Active');
    }
  }, [shipToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!name || !imo || !flag || !status) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const newShipData = { name, imo, flag, status };
    try {
      if (shipToEdit) {
        // Edit existing ship
        await updateShip({ ...shipToEdit, ...newShipData });
        console.log('Ship updated successfully:', name);
      } else {
        // Add new ship
        await addShip(newShipData);
        console.log('New ship added successfully:', name);
      }
      onClose(); // Close the form on success
      navigate('/ships'); // Navigate to ships list (or reload if on same page)
    } catch (err) {
      console.error('Error saving ship:', err);
      setError(err.message || 'Failed to save ship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ship-form-container card">
      <h2>{shipToEdit ? 'Edit Ship' : 'Add New Ship'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imo">IMO Number</label>
          <input
            type="text"
            id="imo"
            value={imo}
            onChange={(e) => setImo(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="flag">Flag</label>
          <input
            type="text"
            id="flag"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            disabled={loading}
          >
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Decommissioned">Decommissioned</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? (shipToEdit ? 'Saving...' : 'Adding...') : (shipToEdit ? 'Update Ship' : 'Add Ship')}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShipForm;