import React, { PropTypes } from 'react';

function SectionTableItem({ header, values }) {
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
        {values.map((value, index) => (
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
  values: PropTypes.arrayOf(PropTypes.node),
};

export default SectionTableItem;
