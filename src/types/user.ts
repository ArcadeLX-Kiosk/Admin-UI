export type Role = 'company' | 'distributor' | 'partner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
}
