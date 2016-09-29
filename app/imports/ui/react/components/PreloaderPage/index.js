import React from 'react';

import Preloader from '../Preloader';

const PreloaderPage = ({ size = 3 }) => (
  <div className="preloader vertical-center table">
    <div className="table-cell text-xs-center">
      <Preloader size={size}/>
    </div>
  </div>
);

export default PreloaderPage;
