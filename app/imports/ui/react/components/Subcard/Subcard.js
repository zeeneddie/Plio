import React from 'react';
import { $ } from 'meteor/jquery';
import { withState } from 'recompose';
import cx from 'classnames';
import curry from 'lodash.curry';
import Preloader from '../Preloader';
import getChildrenByType from '../../helpers/getChildrenByType';

import Title from './Title';
import TitleItem from './TitleItem';
import Content from './Content';
import Help from './Help';

const enhance = withState('collapsed', 'setCollapsed', true);

const Subcard = enhance(({ children, collapsed, setCollapsed, loading }) => {
  let cardBlock;
  
  const getChild = curry(getChildrenByType)(children);
  
  const title = getChild(Title);
  const content = getChild(Content);
  const help = getChild(Help);

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
        {(loading) ? (
          <Title>
            <TitleItem pull="right">
              <Preloader className="margin-bottom" />
            </TitleItem>
          </Title>
        ) : null}
        {title}
      </div>
      <div
        ref={cardBlockRef => { cardBlock = cardBlockRef; }}
        className="card-block-collapse collapse"
      >
        {content}
        {help}
      </div>
    </div>
  );
});

Subcard.Title = Title;
Subcard.TitleItem = TitleItem;
Subcard.Content = Content;
Subcard.Help = Help;

export default Subcard;
