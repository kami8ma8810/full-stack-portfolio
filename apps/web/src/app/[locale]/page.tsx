'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/home/hero';
import { AboutSection } from '@/components/home/about-section';
import { BlogSection } from '@/components/home/blog-section';
import { ProductSection } from '@/components/home/product-section';
import { ContactSection } from '@/components/home/contact-section';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'blog', 'product', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = ['hero', 'about', 'blog', 'product', 'contact'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.key === 'ArrowDown' && e.ctrlKey && currentIndex < sections.length - 1) {
        e.preventDefault();
        const nextSection = sections[currentIndex + 1];
        const element = document.getElementById(nextSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.setAttribute('tabindex', '-1');
          element.focus();
        }
      }
      
      if (e.key === 'ArrowUp' && e.ctrlKey && currentIndex > 0) {
        e.preventDefault();
        const prevSection = sections[currentIndex - 1];
        const element = document.getElementById(prevSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.setAttribute('tabindex', '-1');
          element.focus();
        }
      }

      if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        const heroElement = document.getElementById('hero');
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth' });
          heroElement.setAttribute('tabindex', '-1');
          heroElement.focus();
        }
      }

      if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
          contactElement.setAttribute('tabindex', '-1');
          contactElement.focus();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  return (
    <>
      <Hero />
      <AboutSection />
      <BlogSection />
      <ProductSection />
      <ContactSection />
    </>
  );
}