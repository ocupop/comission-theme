import Lottie from 'lottie-react';
import React from 'react';
import animation from '../lottie/how-it-works-animation.json';

export function HowItWorksAnimation() {
  return (
    <>
      <Lottie animationData={animation} loop={true} />
    </>
  );
}
