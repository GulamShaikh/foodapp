import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageMarquee from './ImageMarquee';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const marqueeContainerRef = useRef(null);

  // Your pizza and drink images - using guaranteed working placeholder URLs as fallbacks
  const foodImages = [
    {
      src: 'https://picsum.photos/300/240?random=1',
      alt: 'Margherita Pizza',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=2',
      alt: 'Fresh Orange Juice',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=3',
      alt: 'Pepperoni Pizza',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=4',
      alt: 'Iced Coffee',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=5',
      alt: 'Gourmet Pizza',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=6',
      alt: 'Fresh Smoothie',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=7',
      alt: 'Cheese Pizza',
      width: '300px'
    },
    {
      src: 'https://picsum.photos/300/240?random=8',
      alt: 'Lemonade',
      width: '300px'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - elements start invisible
      gsap.set([titleRef.current, subtitleRef.current, marqueeContainerRef.current], {
        opacity: 0,
        y: 50
      });

      // Create timeline for scroll-triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            // Animate title with bounce effect
            gsap.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.2
            });

            // Animate subtitle with fade and slide
            gsap.to(subtitleRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.5
            });

            // Animate marquee container with scale effect
            gsap.to(marqueeContainerRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.8
            });
          }
        }
      });

      // Add floating animation to the section
      gsap.to(sectionRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pizza-orange rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pizza-green rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pizza-yellow rounded-full blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 font-lobster"
          >
            <span className="text-pizza-orange">Our Featured</span>{' '}
            <span className="text-pizza-green">Dishes & Drinks</span>
          </h2>
          <p 
            ref={subtitleRef}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-poppins leading-relaxed"
          >
            Discover our delicious pizzas and refreshing beverages crafted with love and finest ingredients
          </p>
        </div>
        
        {/* Enhanced Marquee Container */}
        <div 
          ref={marqueeContainerRef}
          className="relative"
          style={{ transform: 'scale(0.9)' }}
        >
          <ImageMarquee
            images={foodImages}
            speed={60}
            direction="left"
            containerHeight="320px"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-orange-100 hover:shadow-3xl transition-all duration-500"
            imageClassName="rounded-xl shadow-lg hover:scale-110 hover:rotate-2 transition-all duration-500 border-4 border-white hover:border-pizza-orange"
          />
          
          {/* Gradient overlays for seamless edges */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white/80 to-transparent pointer-events-none z-10 rounded-l-2xl"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-10 rounded-r-2xl"></div>
        </div>

        {/* Call to action section */}
        <div className="text-center mt-12">
          <button className="btn-primary group relative overflow-hidden">
            <span className="relative z-10">View Full Menu</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pizza-orange to-pizza-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
