import React, { useState } from "react";
import { motion } from "framer-motion";

export default function EventsSubscription() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribing email:', email);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="bg-black py-16 lg:py-24">
      <div className="max-w-[90%] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#DD4B25] to-[#c43d1b] rounded-3xl p-8 lg:p-16 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYuMjUyIDUuNDI0Yy0uMTktLjE5LS40NDYtLjI5NC0uNzE0LS4yOTQtLjI2OCAwLS41MjQuMTA1LS43MTQuMjk0TDIwLjI5MiAyMC4yNTZjLS4xOS4xOS0uMjkzLjQ0Ny0uMjkzLjcxNSAwIC4yNjcuMTA0LjUyMy4yOTMuNzEzbDUuNjU3IDUuNjU3Yy4xOS4xOS40NDYuMjk0LjcxNC4yOTQuMjY4IDAgLjUyNC0uMTA1LjcxNC0uMjk0TDQyLjkwOCAxMS44MWMuMTktLjE5LjI5My0uNDQ2LjI5My0uNzE0IDAtLjI2OC0uMTA0LS41MjQtLjI5My0uNzE0bC01LjY1Ni01LjY1N3oiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48L3N2Zz4=')] rotate-45 opacity-5" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-white text-4xl lg:text-5xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-white/90 text-lg lg:text-xl max-w-2xl mb-8">
                Join our newsletter and be the first to know about upcoming events, exclusive offers, and industry insights.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  required
                />
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 text-green-400 text-sm"
                  >
                    Thanks for subscribing!
                  </motion.div>
                )}
              </div>
              
              <motion.button
                type="submit"
                className="px-8 py-4 bg-white text-[#DD4B25] rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
                disabled={isSubmitted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe Now
              </motion.button>
            </motion.form>

            <motion.p
              className="text-white/60 text-sm mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              By subscribing, you agree to receive event updates and newsletters. You can unsubscribe at any time.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
