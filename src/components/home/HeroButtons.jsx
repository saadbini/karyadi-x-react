import React from 'react';
import { Link } from 'react-router-dom';
import { BUTTONS } from '../../utils/constants';
import { buttonStyles } from '../../utils/styles';

export function HeroButtons() {
  return (
<div className="flex flex-wrap gap-4">
  <a href="https://www.dynamiktechnologies.com.bn/" target="_blank">
    <button className={`${buttonStyles.primary} hover:scale-105 transition-transform duration-300`}>
      {BUTTONS.DYNAMIK}
    </button>
  </a>
  <Link to="/jobs">
    <button className={`${buttonStyles.primary} hover:scale-105 transition-transform duration-300`}>
      {BUTTONS.JOB_PORTAL}
    </button>
  </Link>
  <Link to="/events">
    <button className={`${buttonStyles.primary} hover:scale-105 transition-transform duration-300`}>
      {BUTTONS.EVENT_PORTAL}
    </button>
  </Link>
</div>


  );
}