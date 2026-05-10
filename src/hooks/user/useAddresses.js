// Fetches the buyer's saved addresses. Falls back to MOCK_ADDRESSES when backend unavailable.
import { useState, useEffect, useCallback } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../api/user.api';

export const MOCK_ADDRESSES = [
  {
    id: 'addr-1', label: 'Home', isDefault: true,
    street: '12 Awka Road', city: 'Onitsha', state: 'Anambra',
    country: 'NG', postalCode: '434101',
  },
  {
    id: 'addr-2', label: 'Office', isDefault: false,
    street: '45 Marina Street', city: 'Lagos', state: 'Lagos',
    country: 'NG', postalCode: '101001',
  },
];

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchAddresses = useCallback(() => {
    setLoading(true);
    getAddresses()
      .then((res) => setAddresses(res.data ?? []))
      .catch(() => setAddresses(MOCK_ADDRESSES))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const handleAdd = async (body) => {
    try { await addAddress(body); fetchAddresses(); return true; }
    catch { return false; }
  };

  const handleUpdate = async (id, body) => {
    try { await updateAddress(id, body); fetchAddresses(); return true; }
    catch { return false; }
  };

  const handleDelete = async (id) => {
    try { await deleteAddress(id); fetchAddresses(); return true; }
    catch { return false; }
  };

  const handleSetDefault = async (id) => {
    try { await setDefaultAddress(id); fetchAddresses(); return true; }
    catch { return false; }
  };

  return { addresses, loading, handleAdd, handleUpdate, handleDelete, handleSetDefault };
}
