// src/components/Components/ComponentForm.jsx
// Form for adding/editing ship components. [cite: 9]
import React, { useState } from 'react';

function ComponentForm({ componentToEdit, onSubmit }) {
  const [name, setName] = useState(componentToEdit?.name || '');
  const [serialNumber, setSerialNumber] = useState(componentToEdit?.serialNumber || '');
  const [installDate, setInstallDate] = useState(componentToEdit?.installDate || '');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(componentToEdit?.lastMaintenanceDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !serialNumber || !installDate || !lastMaintenanceDate) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit({ name, serialNumber, installDate, lastMaintenanceDate });
  };

  return (
    <div className="component-form-container">
      <h3>{componentToEdit ? 'Edit Component' : 'Add New Component'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Serial Number</label>
          <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Installation Date</label>
          <input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Last Maintenance Date</label>
          <input type="date" value={lastMaintenanceDate} onChange={(e) => setLastMaintenanceDate(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{componentToEdit ? 'Save Changes' : 'Add Component'}</button>
      </form>
    </div>
  );
}

export default ComponentForm;