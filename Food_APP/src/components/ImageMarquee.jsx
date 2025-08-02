import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ImageMarquee = ({ 
  images = [], 
  speed = 50, 
  direction = 'left',
  className = '',
  imageClassName = '',
  containerHeight = '200px'
}) => {
  const marqueeRef = useRef(null);
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  
  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    const containerElement = containerRef.current;
    
    if (!marqueeElement || !containerElement) return;

    // Initialize image refs array
    imageRefs.current = imageRefs.current.slice(0, images.length * 2);

    // Wait for images to load before calculating width
    const imageElements = marqueeElement.querySelectorAll('img');
    let loadedImages = 0;
    let cleanupFunction = null;
    
    const startAnimation = () => {
      // Calculate the width of one set of images (half the total width)
      const totalWidth = marqueeElement.scrollWidth;
      const singleSetWidth = totalWidth / 2;
      
      // Calculate duration based on speed (pixels per second)
      const duration = singleSetWidth / speed;
      
      // Set initial position
      gsap.set(marqueeElement, { x: 0 });
      
      // Create the infinite animation with smooth easing
      const animation = gsap.to(marqueeElement, {
        x: -singleSetWidth,
        duration: duration,
        ease: 'none',
        repeat: -1
      });

      // Enhanced hover interactions
      const handleMouseEnter = () => {
        animation.pause();
        // Add subtle glow effect to container
        gsap.to(containerElement, {
          boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.25)',
          duration: 0.3,
          ease: 'power2.out'
        });
      };
      
      const handleMouseLeave = () => {
        animation.resume();
        // Remove glow effect
        gsap.to(containerElement, {
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          duration: 0.3,
          ease: 'power2.out'
        });
      };
      
      containerElement.addEventListener('mouseenter', handleMouseEnter);
      containerElement.addEventListener('mouseleave', handleMouseLeave);
      
      // Add staggered entrance animation for images
      gsap.fromTo(imageElements, {
        opacity: 0,
        scale: 0.8,
        y: 30
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
      });

      // Add floating animation to images
      imageElements.forEach((img, index) => {
        gsap.to(img, {
          y: -5,
          duration: 2 + (index % 3) * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.2
        });
      });
      
      cleanupFunction = () => {
        animation.kill();
        containerElement.removeEventListener('mouseenter', handleMouseEnter);
        containerElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    // Check if images are loaded
    if (imageElements.length === 0) {
      startAnimation();
    } else {
      imageElements.forEach((img) => {
        if (img.complete) {
          loadedImages++;
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === imageElements.length) {
              startAnimation();
            }
          };
          img.onerror = () => {
            loadedImages++;
            if (loadedImages === imageElements.length) {
              startAnimation();
            }
          };
        }
      });

      if (loadedImages === imageElements.length) {
        startAnimation();
      }
    }

    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };

  }, [images, speed, direction]);

  // Enhanced image click handler with GSAP animation
  const handleImageClick = (index) => {
    const clickedImage = imageRefs.current[index];
    if (clickedImage) {
      // Create a pulse effect
      gsap.to(clickedImage, {
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(clickedImage, {
            rotate: 360,
            duration: 0.8,
            ease: 'power2.inOut'
          });
        }
      });
    }
  };

  if (!images.length) return null;

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap cursor-pointer relative ${className}`}
      style={{ height: containerHeight }}
    >
      {/* Enhanced background with gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pizza-orange/5 to-transparent opacity-50 animate-pulse"></div>
      
      <div 
        ref={marqueeRef}
        className="inline-flex items-center gap-8 relative z-10"
      >
        {/* First set of images */}
        {images.map((image, index) => (
          <div
            key={`first-${index}`}
            className="relative group"
            onClick={() => handleImageClick(index)}
          >
            <img
              ref={el => imageRefs.current[index] = el}
              src={image.src}
              alt={image.alt || `Marquee image ${index + 1}`}
              className={`h-full object-cover flex-shrink-0 transition-all duration-500 ${imageClassName}`}
              style={{ width: image.width || 'auto' }}
              onError={(e) => {
                console.log('Image failed to load:', image.src);
                e.target.src = 'https://via.placeholder.com/300x240/ff6b35/ffffff?text=Food+Image';
              }}
              loading="lazy"
            />
            {/* Overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-pizza-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            {/* Sparkle effect */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-pizza-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
          </div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {images.map((image, index) => (
          <div
            key={`second-${index}`}
            className="relative group"
            onClick={() => handleImageClick(index + images.length)}
          >
            <img
              ref={el => imageRefs.current[index + images.length] = el}
              src={image.src}
              alt={image.alt || `Marquee image ${index + 1}`}
              className={`h-full object-cover flex-shrink-0 transition-all duration-500 ${imageClassName}`}
              style={{ width: image.width || 'auto' }}
              onError={(e) => {
                console.log('Image failed to load:', image.src);
                e.target.src = 'https://via.placeholder.com/300x240/ff6b35/ffffff?text=Food+Image';
              }}
              loading="lazy"
            />
            {/* Overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-pizza-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            {/* Sparkle effect */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-pizza-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;
