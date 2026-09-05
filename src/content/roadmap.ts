import type { FutureStage } from '../types/curriculum.js';
export const futureStages: FutureStage[] = [
  { id: 'software-web', title: 'Software & Web', topics: ['Git & GitHub', 'Client/server', 'HTML, CSS & JavaScript', 'Browser & DOM', 'Cookies & sessions', 'HTTP & REST', 'JSON', 'Databases & SQL', 'Authentication & authorization'] },
  { id: 'security-fundamentals', title: 'Security Fundamentals', topics: ['CIA triad', 'Assets, threats, vulnerabilities & risk', 'Attack surface & threat modeling', 'Defense in depth & least privilege', 'Authentication & authorization', 'Encryption & hashing', 'Secrets', 'Logging & monitoring', 'Incident response'] },
  { id: 'web-security', title: 'Web Security', topics: ['Injection & XSS', 'CSRF', 'Access control', 'Authentication & sessions', 'SSRF', 'File uploads', 'Security headers & CORS', 'Input validation', 'Secure cookies', 'Secrets & rate limits'] },
  { id: 'api-security', title: 'API Security', topics: ['API architecture & discovery', 'Authentication & authorization', 'Tokens, JWT & OAuth', 'Object-level authorization', 'Validation & rate limits', 'Logging & secrets', 'API gateways', 'Authorized testing'] },
  { id: 'infrastructure', title: 'Infrastructure', topics: ['Servers & SSH', 'Reverse proxies & DNS', 'Firewalls', 'Containers & Docker', 'Linux hardening', 'Backups', 'Monitoring & logging', 'Secrets', 'Infrastructure as code'] },
  { id: 'cloud', title: 'Cloud', topics: ['AWS, Azure & GCP concepts', 'Shared responsibility', 'IAM & least privilege', 'Storage & networks', 'Security groups', 'Secrets & logging', 'Misconfigurations'] },
  { id: 'devsecops', title: 'DevSecOps', topics: ['CI/CD & GitHub Actions', 'SAST & DAST', 'Dependency & secrets scanning', 'SBOM', 'Container security', 'Secure pipelines', 'Supply-chain security'] },
  { id: 'ai-security', title: 'AI Security', topics: ['AI application architecture', 'LLMs: systems vs models', 'Direct & indirect prompt injection', 'Data exposure', 'Tools & permissions', 'Agent authorization & execution', 'Memory & RAG', 'Vector databases', 'AI APIs', 'Model supply chain', 'Logging & risk assessment'] },
  { id: 'practice', title: 'Practice', topics: ['Local labs', 'CTF fundamentals', 'Authorized learning platforms', 'Intentionally vulnerable local apps', 'Secure coding', 'Architecture reviews', 'Threat modeling'] },
];
