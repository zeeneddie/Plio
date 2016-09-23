import React from 'react';
import Preloader from '../Preloader';

const InfiniteLoader = ({ loading = false, size = 1, className }) => (
  <div className={`text-xs-center ${className}`}>
    {loading && <Preloader size={size}/>}
  </div>
);

export default InfiniteLoader;
