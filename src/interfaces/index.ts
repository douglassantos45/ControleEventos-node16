export interface User {
  id: number;
  name: string;
  genus: string;
  cep: string;
  street: string;
  phone: string;
  mail: string;
}

export interface Topic {
  id: number;
  type: string;
}

export interface Article {
  id: number;
  title: string;
  number_id: number;
}

export interface Event {
  id: number;
  name: string;
  federation: string;
  deadline: string;
  start: string;
  end: string;
  coordenator_id: number;
}
