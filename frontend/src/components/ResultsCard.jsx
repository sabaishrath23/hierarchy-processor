import React from 'react';
import { AlertTriangle, Copy } from 'lucide-react';

const ResultsCard = ({ title, items, type }) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <h2>
        {type === 'invalid' ? <AlertTriangle size={18} color="var(--error-text)" /> : <Copy size={18} color="#b27b00" />}
        {title} ({items.length})
      </h2>
      <div className="badge-list">
        {items.map((item, index) => (
          <span key={index} className={`badge ${type}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResultsCard;
