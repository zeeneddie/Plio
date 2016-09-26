import React from 'react';
import { compose, withProps, withHandlers, nest } from 'recompose';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { submit, addFile } from './constants';
import DiscussionFileUploader from '../DiscussionFileUploader';

const MessagesForm = (props) => (
  <div className="chat-form" onSubmit={e => props.onSubmit(e)}>
		<form className="f1">
			<fieldset disabled={props.disabled}>
				<div className="form-group">
					<div className="input-group">
            <div className="input-group-btn file-uploader">
              {props.children}
            </div>
						<input
              name="message"
							type="text"
							className="form-control"
							placeholder="Add a comment"
              autoComplete="off"/>
						<span className="input-group-btn">
							<button type="submit" className="btn btn-secondary">
								<i className="fa fa-angle-right"></i>
							</button>
						</span>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
);

const enhancedForm = withHandlers({
  onSubmit: submit
})(MessagesForm);

const enhancedUploader = withHandlers({
  onAddFile: addFile
})(DiscussionFileUploader);

export default nest(enhancedForm, enhancedUploader);
