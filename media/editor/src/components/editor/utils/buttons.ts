export interface ButtonDefinition {
  id: number;
  value: number;
  side: 'left' | 'right';
}

export function createButtons(): Array<ButtonDefinition> {
  return [
    {
      id: 1,
      value: -10,
      side: 'left'
    },
    {
      id: 2,
      value: -5,
      side: 'left'
    },
    {
      id: 3,
      value: -1,
      side: 'left'
    },
    {
      id: 4,
      value: 1,
      side: 'right'
    },
    {
      id: 5,
      value: 5,
      side: 'right'
    },
    {
      id: 6,
      value: 10,
      side: 'right'
    }
  ];
}
