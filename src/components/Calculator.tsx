import React, { useState } from 'react';

interface CalculatorProps {
  id: string;
  onRemove: () => void;
  className: string;
}

const Calculator: React.FC<CalculatorProps> = ({ id, onRemove, className }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isScientific, setIsScientific] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
    setEquation(prev => prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay('0');
    setEquation(prev => prev + op);
  };

  const handleEquals = () => {
    try {
      const result = eval(equation);
      setDisplay(result.toString());
      setEquation(result.toString());
    } catch (error) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className={className}>
      <div className="widget-header">
        <h3>Calculator</h3>
        <button onClick={onRemove} className="remove-widget">×</button>
      </div>
      <div className="widget-content calculator-content">
        <div className="calculator-display">{display}</div>
        <div className="calculator-buttons">
          <button onClick={() => handleClear()}>C</button>
          <button onClick={() => setIsScientific(!isScientific)}>
            {isScientific ? 'Basic' : 'Scientific'}
          </button>
          <button onClick={() => handleOperator('/')}>/</button>
          <button onClick={() => handleOperator('*')}>×</button>
          
          <button onClick={() => handleNumber('7')}>7</button>
          <button onClick={() => handleNumber('8')}>8</button>
          <button onClick={() => handleNumber('9')}>9</button>
          <button onClick={() => handleOperator('-')}>-</button>
          
          <button onClick={() => handleNumber('4')}>4</button>
          <button onClick={() => handleNumber('5')}>5</button>
          <button onClick={() => handleNumber('6')}>6</button>
          <button onClick={() => handleOperator('+')}>+</button>
          
          <button onClick={() => handleNumber('1')}>1</button>
          <button onClick={() => handleNumber('2')}>2</button>
          <button onClick={() => handleNumber('3')}>3</button>
          <button onClick={() => handleEquals()}>=</button>
          
          <button onClick={() => handleNumber('0')}>0</button>
          <button onClick={() => handleNumber('.')}>.</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 