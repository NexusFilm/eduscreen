import React, { useState } from 'react';

interface CalculatorProps {
  label?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ label = 'Calculator' }) => {
  const [display, setDisplay] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const standardButtons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (operator: string) => {
    const currentValue = parseFloat(display);

    if (lastOperation && !waitingForOperand) {
      calculate();
    }

    setLastOperation(operator);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    const currentValue = parseFloat(display);
    const previousValue = parseFloat(display);
    const operation = lastOperation;

    let result = 0;
    switch (operation) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '×':
        result = previousValue * currentValue;
        break;
      case '÷':
        result = previousValue / currentValue;
        break;
      case '%':
        result = previousValue % currentValue;
        break;
      case '^':
        result = Math.pow(previousValue, currentValue);
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setLastOperation(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setLastOperation(null);
    setWaitingForOperand(false);
  };

  const handleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handleEquals = () => {
    if (lastOperation && !waitingForOperand) {
      calculate();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Header with mode toggle - 40px height */}
      <div className="h-10 flex justify-between items-center px-4 border-b">
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <button
          onClick={() => setIsScientific(!isScientific)}
          className="px-2 py-1 text-xs font-medium rounded-md
            transition-all duration-200"
          style={{
            background: isScientific ? 'var(--primary-color)' : 'white',
            color: isScientific ? 'white' : 'var(--primary-color)',
            border: `1px solid var(--primary-color)`
          }}
        >
          {isScientific ? 'Basic' : 'Scientific'}
        </button>
      </div>

      {/* Display - 60px height */}
      <div className="h-15 p-4 bg-gray-50">
        <div className="text-right">
          <div className="text-2xl font-medium text-gray-900 truncate">
            {display}
          </div>
        </div>
      </div>

      {/* Keypad - 200px height */}
      <div className="flex-1 p-2 grid grid-cols-4 gap-1">
        {standardButtons.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') handleClear();
                  else if (btn === '±') setDisplay(n => (parseFloat(n) * -1).toString());
                  else if (btn === '=') handleEquals();
                  else if ('÷×+-'.includes(btn)) handleOperator(btn);
                  else if (btn === '.') {
                    if (!display.includes('.')) setDisplay(d => d + '.');
                  }
                  else handleNumber(btn);
                }}
                className={`
                  ${btn === '=' ? 'col-span-2 bg-primary-color text-white' : ''}
                  ${['÷', '×', '-', '+'].includes(btn) ? 'bg-gray-100' : 'bg-white'}
                  rounded-lg text-sm font-medium
                  hover:bg-opacity-90 active:transform active:scale-95
                  transition-all duration-150
                `}
                style={{
                  height: '40px'
                }}
              >
                {btn}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};