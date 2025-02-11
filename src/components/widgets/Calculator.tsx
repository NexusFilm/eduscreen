import React, { useState } from 'react';

interface CalculatorProps {
  label?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ label = 'Calculator' }) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [isScientific, setIsScientific] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const standardButtons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['x²', 'x³', '√', 'log'],
    ['(', ')', 'exp', '^'],
    ['MC', 'MR', 'M+', 'M-']
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
    setHistory([...history, display, operator]);
  };

  const calculate = () => {
    const currentValue = parseFloat(display);
    const previousValue = parseFloat(history[history.length - 2]);
    const operation = history[history.length - 1];

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
    setHistory([]);
    setLastOperation(null);
    setWaitingForOperand(true);
  };

  const handleScientificFunction = (func: string) => {
    const currentValue = parseFloat(display);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin(currentValue);
        break;
      case 'cos':
        result = Math.cos(currentValue);
        break;
      case 'tan':
        result = Math.tan(currentValue);
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'x²':
        result = Math.pow(currentValue, 2);
        break;
      case 'x³':
        result = Math.pow(currentValue, 3);
        break;
      case '√':
        result = Math.sqrt(currentValue);
        break;
      case 'log':
        result = Math.log10(currentValue);
        break;
      case 'exp':
        result = Math.exp(currentValue);
        break;
      case 'MC':
        setMemory(0);
        return;
      case 'MR':
        setDisplay(memory.toString());
        return;
      case 'M+':
        setMemory(memory + currentValue);
        return;
      case 'M-':
        setMemory(memory - currentValue);
        return;
    }

    setDisplay(result.toString());
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setLastOperation(null);
    setHistory([]);
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

  const renderButton = (btn: string) => {
    const isOperator = ['÷', '×', '-', '+', '=', '%', '^'].includes(btn);
    const isFunction = ['sin', 'cos', 'tan', 'log', 'exp'].includes(btn);
    const isMemory = ['MC', 'MR', 'M+', 'M-'].includes(btn);

    return (
      <button
        key={btn}
        onClick={() => {
          if (btn === 'C') handleClear();
          else if (btn === '±') handleSign();
          else if (btn === '.') handleDecimal();
          else if (btn === '=') handleEquals();
          else if (isOperator) handleOperator(btn);
          else if (isFunction || isMemory || ['π', 'x²', 'x³', '√'].includes(btn)) handleScientificFunction(btn);
          else handleNumber(btn);
        }}
        className={`
          p-3 text-sm font-medium rounded-lg transition-all duration-200
          ${btn === '=' ? 'col-span-2 bg-primary-color text-white' : ''}
          ${isOperator ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white hover:bg-gray-100'}
          ${isFunction || isMemory ? 'bg-gray-100 hover:bg-gray-200' : ''}
          active:scale-95 shadow-sm hover:shadow-md
        `}
        style={{
          color: isOperator ? 'var(--primary-color)' : undefined,
        }}
      >
        {btn}
      </button>
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg h-full flex flex-col">
      {/* Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        <button
          onClick={() => setIsScientific(!isScientific)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg
            transition-all duration-200 hover:shadow-md active:scale-95"
          style={{
            background: isScientific ? 'var(--primary-color)' : 'white',
            color: isScientific ? 'white' : 'var(--primary-color)',
            border: `1px solid var(--primary-color)`
          }}
        >
          {isScientific ? 'Standard' : 'Scientific'}
        </button>
      </div>

      {/* Display */}
      <div className="bg-white p-4 rounded-lg mb-4 shadow-inner">
        <div className="text-right">
          <div className="text-gray-500 text-sm mb-1">
            {history.join(' ')}
          </div>
          <div className="text-3xl font-medium text-gray-900 break-all">
            {display}
          </div>
        </div>
      </div>

      {/* Keypad */}
      <div className="flex-1 grid gap-2">
        {isScientific && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {scientificButtons.map(row => (
              <React.Fragment key={row.join('')}>
                {row.map(btn => renderButton(btn))}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          {standardButtons.map(row => (
            <React.Fragment key={row.join('')}>
              {row.map(btn => renderButton(btn))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}; 