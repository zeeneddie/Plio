import { $ } from 'meteor/jquery';

import { setIsFullScreenMode } from '/imports/client/store/actions/globalActions';

export default onToggleScreenMode = props => (e) => {
  const $div = $(e.target).closest('.content-cards-inner');
  const offset = $div.offset();

  if (props.isFullScreenMode) {
    props.dispatch(setIsFullScreenMode(false));

    setTimeout(() => {
      const css = {
        position: 'inherit',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        transition: 'none',
      };

      $div.css(css);
    }, 150);
  } else {
    const css = {
      position: 'fixed',
      top: offset.top,
      right: $(window).width() - (offset.left + $div.outerWidth()),
      bottom: '0',
      left: offset.left,
    };
    $div.css(css);

    setTimeout(() => {
      // Safari workaround
      $div.css({ transition: 'all .15s linear' });

      props.dispatch(setIsFullScreenMode(true));
    }, 100);
  }
};
