import React, { PropTypes } from 'react';

function SectionTableItem({ header, children }) {
  return (
    <table className="table borderless big">
      <thead>
        <tr>
          {header.map((head, index) => (
            <th
              key={`document-field-title-${index}`}
              className="list-group-item-text"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children.map((value, index) => (
          <tr key={`document-record-${index}`}>
            {value.map((cell, cellIndex) => (
              <td key={`document-cell-${cellIndex}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

SectionTableItem.propTypes = {
  header: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.arrayOf(PropTypes.node),
};

export default SectionTableItem;
