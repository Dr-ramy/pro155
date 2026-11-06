const domain =
  process.env.NEXTAUTH_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export default domain;
