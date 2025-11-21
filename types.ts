
export interface Order {
  id: string;
  clientName: string;
  hamburgerBuns: number;
  mediumHamburgerBuns: number; // Novo tipo de pão
  bisnagaBuns: number;
  baguettes: number;
  requestDate: string; // Storing date as ISO string
}

export interface Client {
  id: string;
  name: string;
}

export type View = 'form' | 'dashboard' | 'financial';
