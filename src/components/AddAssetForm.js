import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddAssetForm = ({ onAssetAdded }) => {
  const [assetType, setAssetType] = useState('stock');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add an asset.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/portfolio', {
        asset_type: assetType,
        symbol,
        quantity: parseFloat(quantity),
        purchase_price: parseFloat(purchasePrice),
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onAssetAdded(response.data);
      setSymbol('');
      setQuantity('');
      setPurchasePrice('');
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Failed to add asset.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Asset</h3>
      <div>
        <label>Asset Type:</label>
        <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
          <option value="stock">Stock</option>
          <option value="crypto">Crypto</option>
          <option value="etf">ETF</option>
        </select>
      </div>
      <div>
        <label>Symbol:</label>
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
      </div>
      <div>
        <label>Quantity:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div>
        <label>Purchase Price:</label>
        <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required />
      </div>
      <button type="submit">Add Asset</button>
    </form>
  );
};

export default AddAssetForm;
