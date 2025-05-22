// bad practice. But ok for test project

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Analyze = {
  id: string | number;
  category: string;
  distortions: string;
  alternative: string;
};

export type Solution = {
  id: string | number;
  description: string;
  solution: string;
  reason: string;
  status: string;
  analyze?: Analyze;
};

export type Status = 'pending' | 'analyzed' | 'error';

export type CreateSolution = {
  description: string;
  solution: string;
  reason?: string;
};
