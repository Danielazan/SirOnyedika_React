
// // // Navbar.jsx
// // import { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
// // import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
// // import { useAuth } from '../../contexts/AuthContext';

// // const navItems = [
// //   { label: 'Home', href: '/' },
// //   { label: 'Shop', href: '/shop' },
// //   { label: 'About Us', href: '/about' },
// //   { label: 'Collection', href: '/cart' },
// //   { label: 'Testimonial', href: '/testimonials' },
// //   { label: 'Contact', href: '/contact' },
// // ];

// // export default function Navbar() {
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// //   const { isAuthenticated, logout } = useAuth();
// //   const navigate = useNavigate();
// //   const { scrollY } = useScroll();

// //   useMotionValueEvent(scrollY, 'change', (latest) => {
// //     setIsScrolled(latest > 20);
// //   });

// //   useEffect(() => {
// //     if (isMobileOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = '';
// //     }
// //     return () => { document.body.style.overflow = ''; };
// //   }, [isMobileOpen]);

// //   const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

// //   // Smart Auth Button Click
// //   const handleAuthClick = () => {
// //     if (isAuthenticated) {
// //       navigate('/shop');
// //     } else {
// //       navigate('/login');
// //     }
// //   };

// //   return (
// //     <>
// //       <motion.header
// //         initial={{ y: -120, opacity: 0 }}
// //         animate={{ y: 0, opacity: 1 }}
// //         transition={{ duration: 1.1, ease: [0.22, 1.1, 0.36, 1.05], type: 'spring', stiffness: 80, damping: 14 }}
// //         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
// //           isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
// //         }`}
// //       >
// //         <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
// //           <div className="flex h-20 items-center justify-between">
// //             {/* Logo */}
// //             <Link to="/" className="flex items-center gap-2.5">
// //               <span className="font-['Pacifico'] text-3xl font-bold tracking-tight text-black">
// //                 Fashly
// //               </span>
// //             </Link>

// //             {/* Desktop Nav */}
// //             <nav className="hidden lg:flex items-center gap-9">
// //               {navItems.map((item) => (
// //                 <Link
// //                   key={item.href}
// //                   to={item.href}
// //                   className="relative text-base font-medium text-black hover:text-gray-700 transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
// //                 >
// //                   {item.label}
// //                 </Link>
// //               ))}
// //             </nav>

// //             {/* Actions */}
// //             <div className="flex items-center gap-5 sm:gap-7">
// //               <button aria-label="Cart" className="relative text-gray-700 hover:text-black hidden md:block">
// //                 <ShoppingCart className="h-6 w-6" />
// //               </button>

// //               <button aria-label="Search" className="text-gray-700 hover:text-black hidden md:block">
// //                 <Search className="h-6 w-6" />
// //               </button>

// //               {/* Smart Login / Shop Button */}
// //               <button
// //                 onClick={handleAuthClick}
// //                 className="w-32 h-10 rounded-2xl flex items-center justify-center text-white bg-[#DA5605] font-medium font-[Poppins] gap-2 px-4 hover:bg-[#c04a04] transition-all"
// //               >
// //                 <User className="h-5 w-5" />
// //                 {isAuthenticated ? 'Shop Now' : 'Login'}
// //               </button>

// //               {isAuthenticated && (
// //                 <button
// //                   onClick={logout}
// //                   className="text-sm text-gray-600 hover:text-red-600 transition-colors hidden md:block"
// //                 >
// //                   Logout
// //                 </button>
// //               )}

// //               {/* Mobile Menu Button */}
// //               <button
// //                 className="lg:hidden text-gray-700 hover:text-black"
// //                 onClick={toggleMobileMenu}
// //               >
// //                 {isMobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </motion.header>

// //       {/* Mobile Menu ... (keep your existing mobile menu, just update the auth part) */}
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: isMobileOpen ? 1 : 0, pointerEvents: isMobileOpen ? 'auto' : 'none' }}
// //         className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
// //         onClick={() => setIsMobileOpen(false)}
// //       />

// //       <motion.nav
// //         initial={{ x: '100%' }}
// //         animate={{ x: isMobileOpen ? 0 : '100%' }}
// //         transition={{ type: 'spring', damping: 25, stiffness: 180 }}
// //         className="fixed right-0 top-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-2xl lg:hidden"
// //       >
// //         <div className="flex h-20 items-center justify-between px-6 border-b">
// //           <span className="text-2xl font-bold text-gray-900 font-['Pacifico']">Fashly</span>
// //           <button onClick={() => setIsMobileOpen(false)}>
// //             <X className="h-7 w-7" />
// //           </button>
// //         </div>

// //         <div className="flex flex-col px-6 py-10 space-y-6 text-lg font-medium">
// //           {navItems.map((item) => (
// //             <Link
// //               key={item.href}
// //               to={item.href}
// //               onClick={() => setIsMobileOpen(false)}
// //               className="text-gray-800 hover:text-black transition-colors"
// //             >
// //               {item.label}
// //             </Link>
// //           ))}

// //           <div className="pt-6 border-t flex flex-col gap-6">
// //             <button
// //               onClick={() => {
// //                 handleAuthClick();
// //                 setIsMobileOpen(false);
// //               }}
// //               className="flex items-center gap-3 text-gray-800 hover:text-black text-left"
// //             >
// //               <User className="h-5 w-5" />
// //               <span>{isAuthenticated ? 'Go to Shop' : 'Login / Sign Up'}</span>
// //             </button>

// //             <Link
// //               to="/cart"
// //               onClick={() => setIsMobileOpen(false)}
// //               className="flex items-center gap-3 text-gray-800 hover:text-black"
// //             >
// //               <ShoppingCart className="h-5 w-5" />
// //               <span>Cart</span>
// //             </Link>
// //           </div>
// //         </div>
// //       </motion.nav>
// //     </>
// //   );
// // }

// // Navbar.jsx
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
// import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// const navItems = [
//   { label: 'Home', href: '/' },
//   { label: 'Shop', href: '/shop' },
//   { label: 'About Us', href: '/about' },
//   { label: 'Collection', href: '/cart' },
//   { label: 'Testimonial', href: '/testimonials' },
//   { label: 'Contact', href: '/contact' },
// ];

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const { scrollY } = useScroll();

//   useMotionValueEvent(scrollY, 'change', (latest) => {
//     setIsScrolled(latest > 20);
//   });

//   useEffect(() => {
//     if (isMobileOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => { document.body.style.overflow = ''; };
//   }, [isMobileOpen]);

//   const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

//   // Smart Auth Button Click
//   const handleAuthClick = () => {
//     if (isAuthenticated) {
//       navigate('/shop');
//     } else {
//       navigate('/login');
//     }
//   };

//   return (
//     <>
//       <motion.header
//         initial={{ y: -120, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 1.1, ease: [0.22, 1.1, 0.36, 1.05], type: 'spring', stiffness: 80, damping: 14 }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
//         }`}
//       >
//         <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
//           <div className="flex h-20 items-center justify-between">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2.5">
//               <span className="font-['Pacifico'] text-3xl font-bold tracking-tight text-black">
//                 Fashly
//               </span>
//             </Link>

//             {/* Desktop Nav */}
//             <nav className="hidden lg:flex items-center gap-9">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   to={item.href}
//                   className="relative text-base font-medium text-black hover:text-gray-700 transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>

//             {/* Actions - Updated to match the new navbar image: Search, Cart, Account (person icon), Login button */}
//             <div className="flex items-center gap-5 sm:gap-7">
//               <button aria-label="Search" className="text-gray-700 hover:text-black hidden md:block">
//                 <Search className="h-6 w-6" />
//               </button>

//               <button aria-label="Cart" className="relative text-gray-700 hover:text-black hidden md:block">
//                 <ShoppingCart className="h-6 w-6" />
//               </button>

//               {/* New: Person icon representing "Account" (desktop view) */}
//               <button
//                 aria-label="Account"
//                 onClick={handleAuthClick}
//                 className="text-gray-700 hover:text-black hidden md:block"
//               >
//                 <User className="h-6 w-6" />
//               </button>

//               {/* Smart Login / Shop Button - only minimal UI tweak (removed internal User icon + gap) to match the clean Login button in the updated image; all original logic untouched */}
//               <button
//                 onClick={handleAuthClick}
//                 className="w-32 h-10 rounded-2xl flex items-center justify-center text-white bg-[#DA5605] font-medium font-[Poppins] px-4 hover:bg-[#c04a04] transition-all"
//               >
//                 {isAuthenticated ? 'Shop Now' : 'Login'}
//               </button>

//               {isAuthenticated && (
//                 <button
//                   onClick={logout}
//                   className="text-sm text-gray-600 hover:text-red-600 transition-colors hidden md:block"
//                 >
//                   Logout
//                 </button>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 className="lg:hidden text-gray-700 hover:text-black"
//                 onClick={toggleMobileMenu}
//               >
//                 {isMobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       {/* Mobile Menu ... (keep your existing mobile menu, just update the auth part) */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: isMobileOpen ? 1 : 0, pointerEvents: isMobileOpen ? 'auto' : 'none' }}
//         className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
//         onClick={() => setIsMobileOpen(false)}
//       />

//       <motion.nav
//         initial={{ x: '100%' }}
//         animate={{ x: isMobileOpen ? 0 : '100%' }}
//         transition={{ type: 'spring', damping: 25, stiffness: 180 }}
//         className="fixed right-0 top-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-2xl lg:hidden"
//       >
//         <div className="flex h-20 items-center justify-between px-6 border-b">
//           <span className="text-2xl font-bold text-gray-900 font-['Pacifico']">Fashly</span>
//           <button onClick={() => setIsMobileOpen(false)}>
//             <X className="h-7 w-7" />
//           </button>
//         </div>

//         <div className="flex flex-col px-6 py-10 space-y-6 text-lg font-medium">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               to={item.href}
//               onClick={() => setIsMobileOpen(false)}
//               className="text-gray-800 hover:text-black transition-colors"
//             >
//               {item.label}
//             </Link>
//           ))}

//           <div className="pt-6 border-t flex flex-col gap-6">
//             {/* New: Person icon representing "Account" (mobile view) - added without touching any existing button logic */}
//             <button
//               onClick={() => {
//                 handleAuthClick();
//                 setIsMobileOpen(false);
//               }}
//               className="flex items-center gap-3 text-gray-800 hover:text-black text-left"
//             >
//               <User className="h-5 w-5" />
//               <span>Account</span>
//             </button>

//             {/* Original mobile auth button - completely untouched */}
//             <button
//               onClick={() => {
//                 handleAuthClick();
//                 setIsMobileOpen(false);
//               }}
//               className="flex items-center gap-3 text-gray-800 hover:text-black text-left"
//             >
//               <User className="h-5 w-5" />
//               <span>{isAuthenticated ? 'Go to Shop' : 'Login / Sign Up'}</span>
//             </button>

//             <Link
//               to="/cart"
//               onClick={() => setIsMobileOpen(false)}
//               className="flex items-center gap-3 text-gray-800 hover:text-black"
//             >
//               <ShoppingCart className="h-5 w-5" />
//               <span>Cart</span>
//             </Link>
//           </div>
//         </div>
//       </motion.nav>
//     </>
//   );
// }

// Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Collection', href: '/cart' },
  { label: 'Testimonial', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  // Smart Auth Button Click (used by the orange "Login / Shop Now" button)
  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/shop');
    } else {
      navigate('/login');
    }
  };

  // NEW: Dedicated handler for the Account (person) icon
  // → Goes to /account/profile when logged in (the account dashboard)
  // → Goes to /login when not authenticated
  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1.1, 0.36, 1.05], type: 'spring', stiffness: 80, damping: 14 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="font-['Pacifico'] text-3xl font-bold tracking-tight text-black">
                Fashly
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-9">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative text-base font-medium text-black hover:text-gray-700 transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-5 sm:gap-7">
              <button aria-label="Search" className="text-gray-700 hover:text-black hidden md:block">
                <Search className="h-6 w-6" />
              </button>

              <button aria-label="Cart" className="relative text-gray-700 hover:text-black hidden md:block">
                <ShoppingCart className="h-6 w-6" />
              </button>

              {/* Account (person) icon - now correctly navigates to account page when logged in */}
              <button
                aria-label="Account"
                onClick={handleAccountClick}
                className="text-gray-700 hover:text-black hidden md:block"
              >
                <User className="h-6 w-6" />
              </button>

              {/* Smart Login / Shop Button (unchanged) */}
              <button
                onClick={handleAuthClick}
                className="w-32 h-10 rounded-2xl flex items-center justify-center text-white bg-[#DA5605] font-medium font-[Poppins] px-4 hover:bg-[#c04a04] transition-all"
              >
                {isAuthenticated ? 'Shop Now' : 'Login'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors hidden md:block"
                >
                  Logout
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-700 hover:text-black"
                onClick={toggleMobileMenu}
              >
                {isMobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileOpen ? 1 : 0, pointerEvents: isMobileOpen ? 'auto' : 'none' }}
        className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
        onClick={() => setIsMobileOpen(false)}
      />

      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isMobileOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="fixed right-0 top-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-2xl lg:hidden"
      >
        <div className="flex h-20 items-center justify-between px-6 border-b">
          <span className="text-2xl font-bold text-gray-900 font-['Pacifico']">Fashly</span>
          <button onClick={() => setIsMobileOpen(false)}>
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col px-6 py-10 space-y-6 text-lg font-medium">
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
            {/* Account (person) icon in mobile - now correctly goes to account page */}
            <button
              onClick={() => {
                handleAccountClick();
                setIsMobileOpen(false);
              }}
              className="flex items-center gap-3 text-gray-800 hover:text-black text-left"
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </button>

            {/* Original mobile auth button (completely untouched) */}
            <button
              onClick={() => {
                handleAuthClick();
                setIsMobileOpen(false);
              }}
              className="flex items-center gap-3 text-gray-800 hover:text-black text-left"
            >
              <User className="h-5 w-5" />
              <span>{isAuthenticated ? 'Go to Shop' : 'Login / Sign Up'}</span>
            </button>

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