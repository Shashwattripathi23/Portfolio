"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectImageCarouselProps {
  images: string[];
  projectName: string;
}

export default function ProjectImageCarousel({
  images,
  projectName,
}: ProjectImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const openModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getItemStyle = (index: number) => {
    let distance = index - currentIndex;

    if (distance > images.length / 2) {
      distance = distance - images.length;
    } else if (distance < -images.length / 2) {
      distance = distance + images.length;
    }

    const absDistance = Math.abs(distance);
    const isInView = absDistance <= 2;

    if (!isInView)
      return { opacity: 0, scale: 0.6, blur: 20, offset: distance };

    if (absDistance === 0) {
      return { opacity: 1, scale: 1, blur: 0, zIndex: 10, offset: distance };
    }

    const blur = absDistance * 8;
    const scale = 1 - absDistance * 0.15;
    const opacity = 1 - absDistance * 0.3;

    return { opacity, scale, blur, zIndex: 10 - absDistance, offset: distance };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg--500">
      {/* Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-50"
        >
          ←
        </button>

        {/* Images Container */}
        <div className="relative flex items-center justify-center">
          {images.map((image, index) => {
            const style = getItemStyle(index);
            const offset = style.offset * 300;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: style.opacity,
                  scale: style.scale,
                  x: offset,
                  filter: `blur(${style.blur}px)`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  zIndex: style.zIndex,
                  width: "400px",
                  height: "300px",
                }}
                onClick={() => {
                  if (index === currentIndex) {
                    openModal(index);
                  } else if (index === (currentIndex + 1) % images.length) {
                    handleNext();
                  } else if (
                    index ===
                    (currentIndex - 1 + images.length) % images.length
                  ) {
                    handlePrev();
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className="cursor-pointer"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={`/assets/${image}`}
                    alt={`${projectName} ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/800x600/000000/FFFFFF?text=Image+Not+Found";
                    }}
                  />
                  {/* Overlay for non-focused slides */}
                  {index !== currentIndex && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-50"
        >
          →
        </button>

        {/* Counter
        <div className="absolute bottom-8 right-8 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-base  border-white/20 font-medium z-50">
          {currentIndex + 1} / {images.length}
        </div> */}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating && index !== currentIndex) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                disabled={isAnimating}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/40 w-2 hover:bg-white/60"
                } disabled:cursor-not-allowed`}
              />
            ))}
          </div>
        )}

        {/* Project Title on focused image */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
          {/* <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {projectName}
          </h3> */}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={closeModal}
          >
            {/* Close button */}
            <button
              // onClick={closeModal}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/20 hover:border-white/40 group z-[101]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="group-hover:rotate-90 transition-transform duration-300"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              // Removed overflow-scroll to prioritize containment in the fixed height.
              // If you need scrolling for very tall images, you can add it back,
              // but the image must still use w-full h-full.
              className="relative h-[80vh]  object-contain w-10/12 mx-8 flex items-center justify-center" // Added flex centering
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/assets/${images[modalImageIndex]}`}
                alt={`${projectName} ${modalImageIndex + 1}`}
                // 🔑 KEY CHANGE: Added w-full and h-full to restrict image size
                className="w-full h-full e object-contain rounded-2xl"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/800x600/000000/FFFFFF?text=Image+Not+Found";
                }}
              />

              {/* Image counter */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                {modalImageIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
