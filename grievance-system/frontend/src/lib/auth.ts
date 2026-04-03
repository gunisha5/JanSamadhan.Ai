export type Role = 'ADMIN' | 'CITIZEN';

export function getStoredUser() {
  return {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    role: localStorage.getItem('userRole') as Role | null,
  };
}

export function getFirstName(): string {
  const name = localStorage.getItem('userName') || localStorage.getItem('userEmail') || '';
  return name.split(/\s+/)[0] || 'Citizen';
}

export function isAdmin(): boolean {
  return localStorage.getItem('userRole') === 'ADMIN';
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}
