export interface Widget {
  id: string;
  type: 'timer' | 'notes' | 'calculator';
  label: string;
  size: string;
  position: {
    x: number;
    y: number;
  };
} 