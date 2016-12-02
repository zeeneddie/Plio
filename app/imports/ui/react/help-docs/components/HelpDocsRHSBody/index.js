import React from 'react';

import { getC } from '/imports/api/helpers';
import Collapse from '../../../components/Collapse';
import HelpDocsRHSBodyHeading from '../HelpDocsRHSBodyHeading';
import HelpDocsRHSBodyContents from '../HelpDocsRHSBodyContents';
import SourceWordDocument from '../../../components/SourceWordDocument';
import SourceRead from '../../../components/SourceRead';
import PreloaderPage from '../../../components/PreloaderPage';
import propTypes from './propTypes';

const HelpDocsRHSBody = (props) => (
  <div className="content-list">
    {props.isReady ? (
      <div>
        <Collapse
          collapsed={props.collapsed}
          onToggleCollapse={props.onToggleCollapse}
          initial={props.initialCollapsed}
        >
          <HelpDocsRHSBodyHeading {...props.helpDoc} />
          <HelpDocsRHSBodyContents
            {...props.helpDoc}
            section={props.helpDocSection}
            file={props.file}
          />
        </Collapse>
        {getC('helpDoc.source.htmlUrl', props) && (
          <SourceWordDocument src={props.helpDoc.source.htmlUrl}>
            <SourceRead id={1} {...props.helpDoc.source} file={props.file} />
          </SourceWordDocument>
        )}
      </div>
    ) : (
      <div className="m-t-3">
        <PreloaderPage size={2} />
      </div>
    )}
  </div>
);

HelpDocsRHSBody.propTypes = propTypes;

export default HelpDocsRHSBody;
