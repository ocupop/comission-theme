import React from 'react';
import { createRoot } from 'react-dom/client';

// Import vanilla javascript
import './checkout-disclaimer.js';

// Import Components
import { HowItWorksAnimation } from './components/Animations';
import DABSelector from './components/DABSelector';
import HelloWorld from './components/HelloWorld';
import Certificate from './components/Certificate';

const COMPONENTS = {
  HelloWorld,
  DABSelector,
  Certificate,
  HowItWorksAnimation,
};

function renderComponentInElement(el) {
  const Component = COMPONENTS[el.dataset.component];
  if (!Component) return;
  // get props from elements data attribute, like the post_id
  const props = Object.assign({}, el.dataset);
  const root = createRoot(el); // createRoot(container!) if you use TypeScript
  root.render(<Component {...props} />, el);
}

document.querySelectorAll('.__react-component').forEach(renderComponentInElement);
