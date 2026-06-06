// AccountLayout — wraps every /account/* page.
// Left sidebar with avatar + nav links, right content area for sub-pages.
// Mobile: sidebar collapses to a horizontal scrolling tab bar at the top.
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShoppingBag, Heart, MapPin, CreditCard, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';

// ── Sidebar navigation items ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Personal Information', href: '/account/profile',  icon: User       },
  { label: 'My Orders',            href: '/account/orders',   icon: ShoppingBag },
  { label: 'Wishlist',             href: '/account/wishlist', icon: Heart       },
  { label: 'Manage Address',       href: '/account/addresses',icon: MapPin      },
  { label: 'Payment Method',       href: '/account/payment',  icon: CreditCard  },
];

// ── Animation variants ────────────────────────────────────────────────────────
const sidebarVariants = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const contentVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', delay: 0.15 } },
};

// ── Trust badges (bottom of page) ─────────────────────────────────────────────
import { Truck, Tag, CreditCard as CreditCardIcon, Headphones } from 'lucide-react';

const TRUST_BADGES = [
  { icon: Truck,          label: 'Free Shipping',    sub: 'On orders above $50' },
  { icon: Tag,            label: 'Members Discount', sub: 'Up to 20% off'       },
  { icon: CreditCardIcon, label: 'Flexible Payment', sub: 'Pay any card/bank'   },
  { icon: Headphones,     label: 'Swift Support',    sub: '24/7 customer care'  },
];

const FOOTER_QUICK = ['About Us', 'Shop', 'Blog', 'Contact'];
const FOOTER_HELP  = ['FAQs', 'Shipping Policy', 'Return Policy', 'Privacy Policy'];

export default function AccountLayout({ children }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href) => location.pathname === href;

  // Avatar initials fallback
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  return (
    <div className="min-h-screen bg-[#F5EFE6] font-['Poppins']">
      <Navbar />

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-6 bg-[#F5EFE6] text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Account</h1>
      </motion.div>

      {/* ── Mobile tab bar ── */}
      <div className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-0 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 text-[11px] font-medium transition-colors border-b-2 ${
                isActive(href)
                  ? 'border-[#AE3E27] text-[#AE3E27]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{label.split(' ')[0]}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 text-[11px] font-medium text-red-500 border-b-2 border-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-5 items-start">

          {/* ── Desktop sidebar ── */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 sticky top-28"
          >
            {/* Avatar + name */}
            <div className="bg-[#AE3E27] px-5 py-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/50">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user?.name ?? 'My Account'}</p>
                <p className="text-[#fce5e0] text-xs truncate">{user?.email ?? ''}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="py-3">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all group ${
                    isActive(href)
                      ? 'bg-[#AE3E27] text-white'
                      : 'text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive(href) ? 'text-white' : 'text-gray-400 group-hover:text-[#AE3E27]'}`} />
                  <span>{label}</span>
                  {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </Link>
              ))}

              {/* Divider */}
              <div className="mx-5 my-2 border-t border-gray-100" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all group"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </nav>
          </motion.aside>

          {/* ── Content panel ── */}
          <motion.main
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <section className="bg-white border-t border-gray-100 py-8 mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <span className="w-9 h-9 rounded-full bg-[#fdf2f0] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#AE3E27]" />
                </span>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#AE3E27] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="font-['Pacifico'] text-2xl font-bold">Atelierselvedge</span>
              <p className="mt-3 text-sm text-[#fce5e0] leading-relaxed">
                Your one-stop destination for curated fashion and lifestyle products.
              </p>
              <div className="flex gap-3 mt-4">
                {['f', 'in', 'yt'].map((s) => (
                  <a key={s} href="#" className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-[11px] font-bold transition-colors">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">Quick Links</h4>
              <ul className="space-y-2">
                {FOOTER_QUICK.map((l) => <li key={l}><a href="#" className="text-sm text-[#fce5e0] hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">Help</h4>
              <ul className="space-y-2">
                {FOOTER_HELP.map((l) => <li key={l}><a href="#" className="text-sm text-[#fce5e0] hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">Contact Info</h4>
              <ul className="space-y-2 text-sm text-[#fce5e0]">
                <li>123 Fashion Street, Lagos</li>
                <li>+234 800 ATELIERSELVEDGE</li>
                <li>hello@atelierselvedge.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-white/20 text-center text-xs text-[#fce5e0]">
            © {new Date().getFullYear()} Atelierselvedge Website Design. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
