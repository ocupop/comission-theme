import React from 'react';
import { createRoot } from 'react-dom/client';
import { HowItWorksAnimation } from './Animations';
import DABSelector from './DABSelector';
import HelloWorld from './HelloWorld';

const COMPONENTS = {
  HelloWorld,
  DABSelector,
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
