
export interface Order {
  id: string;
  clientName: string;
  hamburgerBuns: number;
  bisnagaBuns: number;
  baguettes: number;
  requestDate: string; // Storing date as ISO string
}

export type View = 'form' | 'dashboard' | 'financial';
