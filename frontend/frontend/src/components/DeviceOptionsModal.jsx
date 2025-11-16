import React, { useState } from "react";
import "../styles/modal.css";

export default function DeviceOptionsModal({ 
  open, 
  device, 
  onClose, 
  onDelete, 
  onEdit 
}) {

  if (!open || !device) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-box animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">{device.name}</h3>
        <p className="modal-sub">Room: {device.room}</p>
        <p className="modal-sub">Type: {device.type}</p>

        <div className="modal-actions">

          {/* ✅ EDIT BUTTON */}
          <button 
            className="modal-btn modal-edit"
            onClick={() => onEdit(device)}
          >
            Edit Device
          </button>

          {/* ✅ DELETE BUTTON */}
          <button 
            className="modal-btn modal-delete"
            onClick={() => onDelete(device.id)}
          >
            Delete Device
          </button>

          {/* ✅ CLOSE BUTTON */}
          <button 
            className="modal-btn modal-cancel"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
