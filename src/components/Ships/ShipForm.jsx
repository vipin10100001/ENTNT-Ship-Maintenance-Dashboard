// src/components/Ships/ShipForm.jsx
// Form for creating and editing ships. [cite: 7]
import React, { useState } from 'react';

function ShipForm({ shipToEdit, onSubmit }) {
  const [name, setName] = useState(shipToEdit?.name || '');
  const [imo, setImo] = useState(shipToEdit?.imo || '');
  const [flag, setFlag] = useState(shipToEdit?.flag || '');
  const [status, setStatus] = useState(shipToEdit?.status || 'Active');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !imo || !flag || !status) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit({ name, imo, flag, status });
  };

  return (
    <div className="ship-form-container">
      <h3>{shipToEdit ? 'Edit Ship' : 'Add New Ship'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>IMO Number</label>
          <input type="text" value={imo} onChange={(e) => setImo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Flag</label>
          <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Decommissioned">Decommissioned</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{shipToEdit ? 'Save Changes' : 'Add Ship'}</button>
      </form>
    </div>
  );
}

export default ShipForm;