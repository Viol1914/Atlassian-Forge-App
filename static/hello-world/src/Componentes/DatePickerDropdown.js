import React, { useState } from 'react';

function DatePickerDropdown({ onGenerate, onVisualizar }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleVisualizarClick = () => {
    onVisualizar(startDate, endDate);
  };

  return (
    <div className="datepicker">
      <label style={{ marginBottom: '10px', marginRight: '10px' }}>
        Data Inicial:
        <input style={{ marginLeft: '10px' }} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </label>
      <label style={{ marginBottom: '10px', marginRight: '10px' }}>
        Data Final:
        <input style={{ marginLeft: '10px' }} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </label>
      <button onClick={() => onGenerate(startDate, endDate)}>Gerar</button>
      <button onClick={handleVisualizarClick}>Visualizar</button>
    </div>
  );
}

export default DatePickerDropdown;
