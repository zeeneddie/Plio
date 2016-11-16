import React from 'react';
import { withState } from 'recompose';
import cx from 'classnames';
import $ from 'meteor/jquery';
import Preloader from '../Preloader';

import Title from './Title';
import TitleItem from './TitleItem';

const enhance = withState('collapsed', 'setCollapsed', true);

const Subcard = enhance(({ children, collapsed, setCollapsed, title, loading, muted = null }) => {
  let cardBlock;

  const toggleCollapse = () => {
    $(cardBlock).collapse(!collapsed ? 'hide' : 'show');
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <div
        className={cx('card-block', 'card-block-collapse-toggle', { collapsed })}
        onClick={toggleCollapse}
      >
        <h4 className="card-title pull-xs-left">{title}</h4>
        <h4 className="card-title pull-xs-right">
          {
            (loading)
              ? <Preloader className="margin-bottom" />
              : <span className="text-muted">{muted}</span>
          }
        </h4>
      </div>
      <div
        ref={cardBlockRef => { cardBlock = cardBlockRef; }}
        className="card-block-collapse collapse"
      >
        {children}
      </div>
    </div>
  );
});

Subcard.Title = Title;
Subcard.TitleItem = TitleItem;

export default Subcard;
