// PaymentMethodsPage — Panel 6 of the account area.
// Displays saved payment cards and an "Add Credit/Debit Card" option.
// Visa card is shown as a visual card mockup matching the design.
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Mock saved card data — replace with real API data when ready
const MOCK_CARDS = [
  { id: 'card-1', brand: 'VISA', last4: '4242', expiry: '12 / 26', isDefault: true  },
  { id: 'card-2', brand: 'VISA', last4: '1881', expiry: '08 / 27', isDefault: false },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.1 },
  }),
};

// Visual card component mimicking a physical bank card
function BankCard({ card, onDelete }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(218,86,5,0.18)' }}
      className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-md"
      style={{
        background: 'linear-gradient(135deg, #AE3E27 0%, #8f3320 60%, #8b3203 100%)',
        aspectRatio: '1.586 / 1',
      }}
    >
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/40" />
        <div className="absolute top-8 right-8 w-20 h-20 rounded-full border-2 border-white/30" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-white/10" />
      </div>

      <div className="relative p-5 h-full flex flex-col justify-between">
        {/* Top row: brand + chip */}
        <div className="flex items-center justify-between">
          <div className="w-8 h-6 rounded bg-yellow-300/80 flex items-center justify-center">
            <div className="w-5 h-4 rounded bg-yellow-400/90" />
          </div>
          <span className="text-white font-['Pacifico'] text-lg tracking-wide">{card.brand}</span>
        </div>

        {/* Card number */}
        <div className="text-white tracking-[0.3em] text-sm font-mono">
          •••• •••• •••• {card.last4}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-[9px] uppercase tracking-widest">Expires</p>
            <p className="text-white text-sm font-semibold font-mono">{card.expiry}</p>
          </div>
          {card.isDefault && (
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Default</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState(MOCK_CARDS);

  const removeCard = (id) => setCards((c) => c.filter((card) => card.id !== id));

  return (
    <div>
      {/* ── Section heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100"
      >
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#AE3E27]" />
          Payment Method
        </h2>
      </motion.div>

      {/* ── Saved cards ── */}
      <div className="space-y-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <BankCard card={card} />

            {/* Card actions */}
            <div className="flex sm:flex-col gap-3">
              {!card.isDefault && (
                <button
                  onClick={() => setCards((c) => c.map((ca) => ({ ...ca, isDefault: ca.id === card.id })))}
                  className="text-xs font-semibold text-[#AE3E27] hover:underline"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => removeCard(card.id)}
                className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Add new card CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 pt-5 border-t border-gray-100"
      >
        <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#AE3E27]" />
          Add Credit/Debit Card
        </p>

        {/* Placeholder card form hint */}
        <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
          <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">Card payment powered by Stripe</p>
          <p className="text-xs text-gray-400 mt-1">Your card details are encrypted and never stored on our servers.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="mt-4 px-6 py-2.5 bg-[#AE3E27] hover:bg-[#8f3320] text-white text-sm font-bold rounded-xl transition-all"
          >
            Add New Card
          </motion.button>
        </div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mt-4 text-xs text-gray-400"
        >
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
          All transactions are secured with 256-bit SSL encryption.
        </motion.p>
      </motion.div>
    </div>
  );
}
