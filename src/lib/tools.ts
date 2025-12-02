export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'recon' | 'scanning' | 'exploitation' | 'fuzzing' | 'osint';
  command: string;
  placeholder: string;
  icon: string;
}

export const tools: Tool[] = [
  // Recon Tools
  {
    id: 'subfinder',
    name: 'Subfinder',
    description: 'Fast passive subdomain enumeration tool',
    category: 'recon',
    command: 'subfinder -d {target}',
    placeholder: 'example.com',
    icon: '🔍'
  },
  {
    id: 'amass',
    name: 'Amass',
    description: 'In-depth DNS enumeration and network mapping',
    category: 'recon',
    command: 'amass enum -d {target}',
    placeholder: 'example.com',
    icon: '🗺️'
  },
  {
    id: 'sublist3r',
    name: 'Sublist3r',
    description: 'Subdomain enumeration using search engines',
    category: 'recon',
    command: 'sublist3r -d {target}',
    placeholder: 'example.com',
    icon: '📋'
  },
  {
    id: 'waybackurls',
    name: 'Waybackurls',
    description: 'Fetch URLs from Wayback Machine',
    category: 'recon',
    command: 'waybackurls {target}',
    placeholder: 'example.com',
    icon: '⏮️'
  },
  {
    id: 'gau',
    name: 'GAU',
    description: 'GetAllUrls - Fetch known URLs from AlienVault',
    category: 'recon',
    command: 'gau {target}',
    placeholder: 'example.com',
    icon: '🌐'
  },
  // Scanning Tools
  {
    id: 'nmap',
    name: 'Nmap',
    description: 'Network discovery and security auditing',
    category: 'scanning',
    command: 'nmap -sV -sC {target}',
    placeholder: '192.168.1.1 or example.com',
    icon: '📡'
  },
  {
    id: 'masscan',
    name: 'Masscan',
    description: 'Fast port scanner for large networks',
    category: 'scanning',
    command: 'masscan -p1-65535 {target}',
    placeholder: '192.168.1.0/24',
    icon: '⚡'
  },
  {
    id: 'rustscan',
    name: 'RustScan',
    description: 'Modern port scanner written in Rust',
    category: 'scanning',
    command: 'rustscan -a {target}',
    placeholder: '192.168.1.1',
    icon: '🦀'
  },
  {
    id: 'httpprobe',
    name: 'HTTProbe',
    description: 'Probe for working HTTP/HTTPS servers',
    category: 'scanning',
    command: 'cat domains.txt | httprobe',
    placeholder: 'example.com',
    icon: '🔗'
  },
  {
    id: 'nuclei',
    name: 'Nuclei',
    description: 'Fast vulnerability scanner based on templates',
    category: 'scanning',
    command: 'nuclei -u {target}',
    placeholder: 'https://example.com',
    icon: '☢️'
  },
  {
    id: 'nikto',
    name: 'Nikto',
    description: 'Web server scanner for dangerous files/CGIs',
    category: 'scanning',
    command: 'nikto -h {target}',
    placeholder: 'https://example.com',
    icon: '🕷️'
  },
  {
    id: 'whatweb',
    name: 'WhatWeb',
    description: 'Web scanner for identifying technologies',
    category: 'scanning',
    command: 'whatweb {target}',
    placeholder: 'https://example.com',
    icon: '🔬'
  },
  // Exploitation Tools
  {
    id: 'sqlmap',
    name: 'SQLMap',
    description: 'Automatic SQL injection and database takeover',
    category: 'exploitation',
    command: 'sqlmap -u "{target}"',
    placeholder: 'https://example.com/page?id=1',
    icon: '💉'
  },
  {
    id: 'xsstrike',
    name: 'XSStrike',
    description: 'Advanced XSS detection and exploitation',
    category: 'exploitation',
    command: 'xsstrike -u {target}',
    placeholder: 'https://example.com/search?q=test',
    icon: '⚔️'
  },
  {
    id: 'commix',
    name: 'Commix',
    description: 'Command injection exploiter',
    category: 'exploitation',
    command: 'commix -u {target}',
    placeholder: 'https://example.com/page?cmd=',
    icon: '🎯'
  },
  // Fuzzing Tools
  {
    id: 'gobuster',
    name: 'Gobuster',
    description: 'Directory/DNS/VHost busting tool',
    category: 'fuzzing',
    command: 'gobuster dir -u {target} -w wordlist.txt',
    placeholder: 'https://example.com',
    icon: '👻'
  },
  {
    id: 'ffuf',
    name: 'FFUF',
    description: 'Fast web fuzzer written in Go',
    category: 'fuzzing',
    command: 'ffuf -u {target}/FUZZ -w wordlist.txt',
    placeholder: 'https://example.com',
    icon: '🚀'
  },
  {
    id: 'dirsearch',
    name: 'Dirsearch',
    description: 'Web path discovery tool',
    category: 'fuzzing',
    command: 'dirsearch -u {target}',
    placeholder: 'https://example.com',
    icon: '📂'
  },
  {
    id: 'wfuzz',
    name: 'Wfuzz',
    description: 'Web application fuzzer',
    category: 'fuzzing',
    command: 'wfuzz -c -w wordlist.txt {target}/FUZZ',
    placeholder: 'https://example.com',
    icon: '🔧'
  },
  {
    id: 'arjun',
    name: 'Arjun',
    description: 'HTTP parameter discovery suite',
    category: 'fuzzing',
    command: 'arjun -u {target}',
    placeholder: 'https://example.com/page',
    icon: '🏹'
  },
  // OSINT Tools
  {
    id: 'paramspider',
    name: 'ParamSpider',
    description: 'Mining parameters from dark corners of web',
    category: 'osint',
    command: 'paramspider -d {target}',
    placeholder: 'example.com',
    icon: '🕸️'
  },
];

export const categories = [
  { id: 'recon', name: 'Reconnaissance', icon: '🔍', description: 'Discover subdomains, URLs, and information' },
  { id: 'scanning', name: 'Scanning', icon: '📡', description: 'Port scanning and vulnerability detection' },
  { id: 'exploitation', name: 'Exploitation', icon: '💉', description: 'SQL injection, XSS, and command injection' },
  { id: 'fuzzing', name: 'Fuzzing', icon: '🔧', description: 'Directory and parameter fuzzing' },
  { id: 'osint', name: 'OSINT', icon: '🌐', description: 'Open source intelligence gathering' },
] as const;

export type Category = typeof categories[number]['id'];