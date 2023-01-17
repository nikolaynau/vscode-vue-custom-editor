export interface ButtonDefinition {
  id: number;
  label: string;
  value: number;
  side: 'left' | 'right';
}

export function createButtons(): Array<ButtonDefinition> {
  return [
    {
      id: 1,
      label: '-10',
      value: -10,
      side: 'left'
    },
    {
      id: 2,
      label: '-5',
      value: -5,
      side: 'left'
    },
    {
      id: 3,
      label: '-1',
      value: -1,
      side: 'left'
    },
    {
      id: 4,
      label: '+1',
      value: 1,
      side: 'right'
    },
    {
      id: 5,
      label: '+5',
      value: 5,
      side: 'right'
    },
    {
      id: 6,
      label: '+10',
      value: 10,
      side: 'right'
    }
  ];
}
