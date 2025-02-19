import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditModal = ({ isModalOpen, closeModal, selectedInventory }) => {
    if (!isModalOpen) return null; // Jangan render modal jika tidak terbuka
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 rounded-md">
          <h2>Edit {selectedInventory?.name}</h2>
          <h2>Edit {selectedInventory?.stock}</h2>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  };
    
    export default EditModal;
    