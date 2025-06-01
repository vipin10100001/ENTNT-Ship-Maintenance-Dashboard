// src/components/Components/ComponentForm.jsx
import React, { useState, useEffect } from 'react';
import { useComponents } from '@/contexts/ComponentsContext'; // To use addComponent/updateComponent
import { useShips } from '@/contexts/ShipsContext'; // To get ship names for dropdown
import { useParams } from 'react-router-dom'; // To get shipId if adding from ShipDetailPage

function ComponentForm({ componentToEdit, onClose, shipId: propShipId }) { // Prop for shipId when adding from ShipDetailPage
  const { id: paramShipId } = useParams(); // Get shipId from URL if present
  const currentShipId = propShipId || paramShipId; // Prioritize prop, then URL param

  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installDate, setInstallDate] = useState('');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
  const [associatedShipId, setAssociatedShipId] = useState(currentShipId || ''); // Pre-fill if known
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { addComponent, updateComponent } = useComponents();
  const { ships, loading: loadingShips } = useShips(); // For ship dropdown

  // Populate form if in edit mode
  useEffect(() => {
    if (componentToEdit) {
      setName(componentToEdit.name || '');
      setSerialNumber(componentToEdit.serialNumber || '');
      // Format dates for input[type="date"]
      setInstallDate(componentToEdit.installDate ? new Date(componentToEdit.installDate).toISOString().split('T')[0] : '');
      setLastMaintenanceDate(componentToEdit.lastMaintenanceDate ? new Date(componentToEdit.lastMaintenanceDate).toISOString().split('T')[0] : '');
      setAssociatedShipId(componentToEdit.shipId || '');
    } else {
      // If adding a new component, pre-fill shipId if known from prop/param
      setAssociatedShipId(currentShipId || '');
    }
  }, [componentToEdit, currentShipId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!name || !serialNumber || !installDate || !lastMaintenanceDate || !associatedShipId) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const componentData = {
      name,
      serialNumber,
      installDate,
      lastMaintenanceDate,
      shipId: associatedShipId,
    };

    try {
      if (componentToEdit) {
        // Edit existing component
        await updateComponent({ ...componentToEdit, ...componentData });
        console.log('Component updated successfully:', componentToEdit.id);
      } else {
        // Add new component
        await addComponent(componentData);
        console.log('New component added successfully.');
      }
      onClose(); // Close the form on success
    } catch (err) {
      console.error('Error saving component:', err);
      setError(err.message || 'Failed to save component. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingShips) {
    return <div className="loading-fullscreen">Loading ships data for component form...</div>;
  }

  return (
    <div className="component-form-container card">
      <h2>{componentToEdit ? 'Edit Component' : 'Add New Component'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Component Name</label>
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
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            type="text"
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="installDate">Installation Date</label>
          <input
            type="date"
            id="installDate"
            value={installDate}
            onChange={(e) => setInstallDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastMaintenanceDate">Last Maintenance Date</label>
          <input
            type="date"
            id="lastMaintenanceDate"
            value={lastMaintenanceDate}
            onChange={(e) => setLastMaintenanceDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="associatedShipId">Associated Ship</label>
          <select
            id="associatedShipId"
            value={associatedShipId}
            onChange={(e) => setAssociatedShipId(e.target.value)}
            required
            disabled={loading || !!componentToEdit || !!paramShipId} // Disable if editing or shipId is from URL
          >
            <option value="">Select a Ship</option>
            {ships.map(ship => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
          {/* Display current ship name if editing or pre-filled from URL */}
          {(componentToEdit || paramShipId) && associatedShipId && (
            <p className="form-note">
              {componentToEdit ? 'Currently on: ' : 'Adding to: '}
              {ships.find(s => s.id === associatedShipId)?.name}
            </p>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? (componentToEdit ? 'Saving...' : 'Adding...') : (componentToEdit ? 'Update Component' : 'Add Component')}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComponentForm;