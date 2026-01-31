import { gsap } from 'gsap';

export const animateOnHover = (element) => {
  gsap.to(element, { scale: 1.05, duration: 0.3 });
};

export const resetAnimation = (element) => {
  gsap.to(element, { scale: 1, duration: 0.3 });
};
