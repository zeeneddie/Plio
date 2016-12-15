import React from 'react';

const MessagesForm = (props) => (
  <div className="chat-form" onSubmit={e => props.onSubmit(e)}>
		<form className="f1">
			<fieldset disabled={props.disabled}>
				<div className="form-group">
					<div className="input-group">
            {props.children}
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

export default MessagesForm;
