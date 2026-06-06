// AddressesPage — Panel 5 of the account area.
// Shows saved address cards and an "Add New Address" inline form.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Check, Star, X } from 'lucide-react';
import { useAddresses } from '../../hooks/user/useAddresses';

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.07 },
  }),
};

const COUNTRIES = ['NG', 'GH', 'KE', 'ZA', 'GB', 'US', 'CA'];

const EMPTY_FORM = { label: 'Home', street: '', city: '', state: '', country: 'NG', postalCode: '', isDefault: false };

// Inline address form used for both add and edit
function AddressForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-4 bg-[#fdf2f0]/60 rounded-xl border border-[#AE3E27]/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'label',      label: 'Label',       placeholder: 'Home, Office…', col: 1 },
            { name: 'street',     label: 'Street',      placeholder: '12 Main Street', col: 2 },
            { name: 'city',       label: 'City',        placeholder: 'Lagos',          col: 1 },
            { name: 'state',      label: 'State',       placeholder: 'Lagos',          col: 1 },
            { name: 'postalCode', label: 'Postal Code', placeholder: '100001',         col: 1 },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
              <input
                name={name} value={form[name]} onChange={set} placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-['Poppins'] focus:border-[#AE3E27] focus:ring-2 focus:ring-[#AE3E27]/10 outline-none bg-white"
              />
            </div>
          ))}

          {/* Country select */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Country</label>
            <select
              name="country" value={form.country} onChange={set}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-['Poppins'] focus:border-[#AE3E27] outline-none bg-white"
            >
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Default checkbox */}
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={set} className="w-4 h-4 accent-[#AE3E27]" />
          <span className="text-sm text-gray-600 font-medium">Set as default address</span>
        </label>

        {/* Form actions */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#AE3E27] hover:bg-[#8f3320] text-white text-sm font-bold rounded-lg transition-all disabled:opacity-60"
          >
            <Check className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Save Address'}
          </motion.button>
          <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all">
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AddressesPage() {
  const { addresses, loading, handleAdd, handleUpdate, handleDelete, handleSetDefault } = useAddresses();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [saving,      setSaving]      = useState(false);

  const onAdd = async (form) => {
    setSaving(true);
    const ok = await handleAdd(form);
    setSaving(false);
    if (ok) setShowAddForm(false);
  };

  const onUpdate = async (id, form) => {
    setSaving(true);
    const ok = await handleUpdate(id, form);
    setSaving(false);
    if (ok) setEditingId(null);
  };

  const onDelete = (id) => handleDelete(id);
  const onDefault = (id) => handleSetDefault(id);

  return (
    <div>
      {/* ── Heading + Add button ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100"
      >
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#AE3E27]" />
          Manage Address
        </h2>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setShowAddForm((v) => !v); setEditingId(null); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#AE3E27] hover:bg-[#8f3320] text-white text-xs font-bold rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Address
        </motion.button>
      </motion.div>

      {/* ── Add form ── */}
      <AnimatePresence>
        {showAddForm && (
          <AddressForm
            key="add-form"
            onSave={onAdd}
            onCancel={() => setShowAddForm(false)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* ── Address cards ── */}
      {loading ? (
        <div className="space-y-3 mt-4">
          {[1, 2].map((i) => <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-14">
          <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No addresses saved yet</p>
          <p className="text-gray-400 text-sm mt-1">Add a delivery address to speed up checkout.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`relative rounded-xl border p-4 transition-all ${
                addr.isDefault ? 'border-[#AE3E27]/40 bg-[#fdf2f0]/50' : 'border-gray-100 bg-white'
              }`}
            >
              {/* Default badge */}
              {addr.isDefault && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-[#AE3E27] bg-[#fce5e0] px-2 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-[#AE3E27]" /> Default
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fce5e0] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#AE3E27]" />
                </div>
                <div className="flex-1 min-w-0 pr-16">
                  <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{addr.street}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{addr.country}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-3 ml-11">
                {!addr.isDefault && (
                  <button onClick={() => onDefault(addr.id)} className="text-xs text-[#AE3E27] font-medium hover:underline">
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => setEditingId(editingId === addr.id ? null : addr.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => onDelete(addr.id)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>

              {/* Inline edit form */}
              <AnimatePresence>
                {editingId === addr.id && (
                  <AddressForm
                    key={`edit-${addr.id}`}
                    initial={{ ...addr }}
                    onSave={(form) => onUpdate(addr.id, form)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
