import { useState } from "react";
import { motion } from "framer-motion";

// ── Animation variant: fade up with staggered delay ──
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.22,           // each child animates 220ms after the previous
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1], // custom spring-like ease
    },
  }),
};

export default function Newsletter() {
  // ── State: email value + success flash ──
  // In production, email would be POSTed to a backend newsletter endpoint
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Handle subscribe action ──
  const handleSubscribe = () => {
    if (!email.trim()) return;
    // TODO: POST { email } to /api/newsletter/subscribe
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    /*
     * ── Full-page white section ──
     * Centers all newsletter content vertically & horizontally.
     * Mobile-first: stacks naturally, scales up with sm/md breakpoints.
     */
    <section className="w-full h-auto flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">

        {/* ── 1. Eyebrow label: "Our Newsletter" ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}                     // delay index 0 → animates first
          className="text-sm sm:text-base text-gray-500 tracking-wide mb-3"
        >
          Our Newsletter
        </motion.p>

        {/* ── 2. Main headline ── */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}                     // delay index 1 → animates second
          className="font-[poppins] text-[1.55rem] sm:text-2xl md:text-[1.6rem] font-extrabold text-black leading-snug mb-10"
        >
          Subscribe to our Newsletter to Get{" "}
          <br className="hidden sm:block" />
          Updates to Our Latest Collection
        </motion.h2>

        {/* ── 3. Email pill: input + CTA button ──
             The entire pill shares a single orange border (ellipse shape).
             The Subscribe button sits flush inside the right end of the pill. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}                     // delay index 2 → animates third
          className="w-full"
        >
          <div
            className="flex w-full items-stretch rounded-2xl overflow-hidden"
            style={{ border: "1.8px solid #C8501A" }}
          >
            {/* Email address text input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Enter your Email Address"
              aria-label="Email address"
              className="
                flex-2 min-w-0 bg-white
                text-sm sm:text-base text-gray-700
                placeholder-gray-400
                px-6 sm:px-8 py-4 sm:py-5
                outline-none rounded-l-2xl
              "
            />

            {/* Subscribe CTA button — pill-shaped right half */}
            <motion.button
              onClick={handleSubscribe}
              whileTap={{ scale: 0.96 }}
              whileHover={{ backgroundColor: "#a84015" }}
              transition={{ duration: 0.2 }}
              aria-label="Subscribe to newsletter"
              className="
                shrink-0
                px-7 sm:px-12
                py-4 sm:py-5
                text-white text-sm sm:text-base font-semibold
                rounded-2xl cursor-pointer font-[poppins]
              "
              style={{ backgroundColor: "#C8501A" }}
            >
              {submitted ? "Subscribed ✓" : "Subscribe"}
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}