import React from "react";
import { motion } from "framer-motion";
import { useParallax } from "react-scroll-parallax";

export default function EventsVideo() {
  const { ref } = useParallax({ speed: -10 });

  return (
    <motion.div
      className="w-full bg-black relative py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div ref={ref} className="max-w-[85%] lg:max-w-[75%] mx-auto relative">
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl blur-sm" />

          {/* Inner container with backdrop blur */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm z-10" />
            <video
              className="w-full aspect-video rounded-3xl border border-white/20 relative z-20"
              src="https://media-hosting.imagekit.io//2ae16dce01054ff5/AICREATIVV-TENUN-VIDEO-DRAFT1.mp4?Expires=1832809152&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tcP2iyIZ8NeHbS9pYh~fryn1YIgXfmb7eH~5Po8rhQO5yQG4TuWZSxf0GQlqmkxKkhjg1wNd2cN2IlWZF-kqFgpO8iGGTCZklBHlWGMZY~aJL7Z2VSg7ee0H2ph77yzIpmeCPcacReHpYKKpa476PSnP9pW3h-Bf~seGdqBexI4In4mC8bUiXVgjWu0sxoRA2rwqvTnlsYR-TQzduPcXOuqawUIXkZEbdQq3zO13eAcxYwkkACbN4m6RD1aCYY3kAY7jQu9D0WhgqUg6bcwQFVabFa01F5s9BeAesz-VC2u0~~oMV0kgDXXgofhkHc01at3rBAwYcb6fVCnea5p3Qw__"
              autoPlay
              muted
              loop
              playsInline
            />
            {/* Subtle inner border */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 z-30 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
