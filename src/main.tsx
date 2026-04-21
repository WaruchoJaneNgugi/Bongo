import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Scroll-reveal: add .visible to .reveal elements when they enter the viewport
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // stagger children with data-stagger
      const children = e.target.querySelectorAll('[data-stagger]');
      children.forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
        child.classList.add('visible');
      });
    }
  }),
  { threshold: 0.08 }
);
const observe = () => document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
observe();
new MutationObserver(observe).observe(document.body, { childList: true, subtree: true });

// Parallax on scroll
const parallaxEls = () => document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxEls().forEach(el => {
    const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.15');
    (el as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
