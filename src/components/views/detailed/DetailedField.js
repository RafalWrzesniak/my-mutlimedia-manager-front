import React from 'react';
import '../../../css/detailed-field.css';

const DetailedField = ({ description, value, justified }) => {
  return (
    <div className="detailed-field">
      <div className={justified ? "value-justified" : "value"}>{value}</div>
      <div className="description">{description}</div>
    </div>
  );
};

export default DetailedField;
