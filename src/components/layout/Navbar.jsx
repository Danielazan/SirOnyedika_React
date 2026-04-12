import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // ✅ Added React Router Link
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Collection', href: '/Cart' },
  { label: 'Testimonial', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1.1, 0.36, 1.05],
          type: 'spring',
          stiffness: 80,
          damping: 14,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - ✅ Changed to Link */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="font-['Pacifico'] text-3xl font-bold tracking-tight text-[#000000]">
                Fashly
              </span>
            </Link>

            {/* Desktop Navigation - ✅ Changed to Link */}
            <nav className="hidden lg:flex items-center gap-9">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative text-base font-medium text-[#000000] hover:text-gray-700 transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-5 sm:gap-7">
              <button
                aria-label="Cart"
                className="relative text-gray-700 hover:text-black transition-colors hidden md:block"
              >
                <ShoppingCart className="h-6 w-6" />
              </button>

              <button
                aria-label="Search"
                className="text-gray-700 hover:text-black transition-colors hidden md:block"
              >
                <Search className="h-6 w-6" />
              </button>

              <button className='w-32 h-10 rounded-2xl items-center justify-center text-white bg-[#DA5605] font-[Poppins] font-medium flex gap-2 px-4'>
                <User className="h-5 w-5" />
                Login
              </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-gray-700 hover:text-black"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isMobileOpen ? 1 : 0,
          pointerEvents: isMobileOpen ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isMobileOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="fixed right-0 top-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-2xl lg:hidden"
      >
        <div className="flex h-20 items-center justify-between px-6 border-b">
          <span className="text-2xl font-bold text-gray-900 font-['Pacifico']">
            Fashly
          </span>
          <button onClick={() => setIsMobileOpen(false)}>
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col px-6 py-10 space-y-6 text-lg font-medium">
          {/* ✅ Mobile nav items using Link */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-800 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-6 border-t flex flex-col gap-6">
            {/* ✅ Fixed Search component name + Link */}
            <Link
              to="/account"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 text-gray-800 hover:text-black"
            >
              <Search className="h-5 w-5" />
              <span>Account</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 text-gray-800 hover:text-black"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

