import React from 'react';
import PropTypes from 'prop-types';

HelloWorld.propTypes = {
  title: PropTypes.string,
};

export default function HelloWorld({ title }) {
  return (
    <>
      <h5>Hello World: React Component</h5>
      <p>
        <strong>Title: {title}</strong>
      </p>
    </>
  );
}
