"use client";

import { motion } from "framer-motion";

interface AboutProps {
  onSocialClick: (platform: string) => void;
}

export default function About({ onSocialClick }: AboutProps) {
  const socials = [
    { name: "LinkedIn", url: "https://linkedin.com", icon: "in" },
    { name: "Instagram", url: "https://instagram.com", icon: "ig" },
    { name: "Twitter", url: "https://twitter.com", icon: "tw" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex items-center justify-center px-8"
    >
      <div className="max-w-7xl w-full grid grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="col-span-7 bento-box p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
          <div className="space-y-4 text-white/70 text-lg leading-relaxed">
            <p>
              I'm a full-stack developer passionate about creating beautiful and
              functional web experiences. With expertise in modern technologies
              like React, Next.js, and TypeScript, I bring ideas to life through
              clean code and intuitive design.
            </p>
            <p>
              My journey in web development started with a curiosity about how
              things work on the internet. Today, I specialize in building
              scalable applications that solve real-world problems.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing knowledge with
              the developer community.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
            >
              Download Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-all"
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="col-span-5 space-y-6"
        >
          <div className="bento-box h-80 bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-48 h-48 bg-white/10 rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Connect</h3>
            <div className="grid grid-cols-3 gap-4">
              {socials.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialClick(social.name)}
                  className="bento-box aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                    {social.icon}
                  </div>
                  <span className="text-white/80 text-sm">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
