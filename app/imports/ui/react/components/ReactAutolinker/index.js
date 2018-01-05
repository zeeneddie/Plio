import PropTypes from 'prop-types';
import React from 'react';
import Autolinker from 'autolinker';
import { $ } from 'meteor/jquery';
import { Random } from 'meteor/random';

const ReactAutolinker = ({
  text,
  options,
  renderLink = tag => React.createElement(tag.tagName, tag.attrs, tag.innerHtml || tag.textContent),
  ...props
}) => {
  let tags = [];
  const replaceFn = (match) => {
    const tag = match.buildTag();
    tag.setAttr('data-id', Random.id());
    tags = tags.concat(tag);
    return tag;
  };

  const html = Autolinker.link(text, { ...options, replaceFn });

  const result = $.parseHTML(html).map((node, i) => {
    const $node = $(node);
    if ($node.is('a')) {
      const tag = tags.find(t => t.attrs['data-id'] === $node.attr('data-id'));

      if (typeof tag === 'undefined') {
        const attrs = { ...node.attributes };
        attrs.key = i;
        if (attrs.class) {
          attrs.className = attrs.class;
          delete attrs.class;
        }
        const el = React.createElement('a', attrs, node.innerHtml || node.textContent);

        return el;
      }

      if (tag && tag.attrs) {
        tag.attrs.key = `${tag.attrs.href}-${tags.indexOf(tag)}`;

        delete tag.attrs['data-id'];

        if (tag.attrs.class) {
          tag.attrs.className = tag.attrs.class;
          delete tag.attrs.class;
        }
      }

      return renderLink(tag);
    }

    return node.textContent;
  });

  return <span {...props}>{result}</span>;
};

ReactAutolinker.propTypes = {
  text: PropTypes.string.isRequired,
  options: PropTypes.object,
  renderLink: PropTypes.func,
};

export default ReactAutolinker;
