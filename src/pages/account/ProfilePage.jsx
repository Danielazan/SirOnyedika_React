// ProfilePage — Panel 1 of the account area.
// Shows avatar, first/last name, email, phone fields with Save Changes button.
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, uploadAvatar } from '../../api/user.api';

// Stagger animation for each form row
const rowVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.08 },
  }),
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] ?? '',
    lastName:  user?.name?.split(' ').slice(1).join(' ') ?? '',
    email:     user?.email ?? '',
    phone:     user?.phone ?? '',
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl ?? null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      await uploadAvatar(fd);
    } catch { /* preview still updates */ }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const name = `${form.firstName} ${form.lastName}`.trim();
      await updateProfile({ name, phone: form.phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* toast would go here */ }
    finally { setSaving(false); }
  };

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || 'ME';

  const FIELDS = [
    { label: 'First Name',  name: 'firstName', type: 'text',  placeholder: 'John'          },
    { label: 'Last Name',   name: 'lastName',  type: 'text',  placeholder: 'Doe'           },
    { label: 'Email',       name: 'email',     type: 'email', placeholder: 'john@mail.com', disabled: true },
    { label: 'Phone',       name: 'phone',     type: 'tel',   placeholder: '+234 800 0000'  },
  ];

  return (
    <div>
      {/* ── Section heading ── */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100"
      >
        Personal Information
      </motion.h2>

      <form onSubmit={handleSave}>
        <div className="flex flex-col sm:flex-row gap-6">

          {/* ── Avatar column ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col items-center gap-3 sm:w-32 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#fce5e0] overflow-hidden border-4 border-[#AE3E27]/20 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#AE3E27]">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#AE3E27] flex items-center justify-center shadow-md hover:bg-[#8f3320] transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <p className="text-xs text-gray-400 text-center">Click camera to change</p>
          </motion.div>

          {/* ── Form fields ── */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((f, i) => (
              <motion.div key={f.name} custom={i} variants={rowVariants} initial="hidden" animate="visible">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  disabled={f.disabled}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm font-medium transition-all outline-none font-['Poppins'] ${
                    f.disabled
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'border-gray-200 focus:border-[#AE3E27] focus:ring-2 focus:ring-[#AE3E27]/10 bg-white text-gray-800'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Save button ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="mt-6"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
              saved ? 'bg-green-500' : 'bg-[#AE3E27] hover:bg-[#8f3320]'
            } disabled:opacity-60`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
