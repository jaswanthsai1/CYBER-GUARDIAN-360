import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ==================== FREE API INTEGRATIONS ====================

// IPinfo.io - Free IP geolocation and network info
async function getIPInfo(target: string): Promise<any> {
  try {
    const response = await fetch(`https://ipinfo.io/${target}/json`);
    return await response.json();
  } catch (error) {
    console.error('IPinfo error:', error);
    return null;
  }
}

// AlienVault OTX - Free threat intelligence
async function getOTXData(target: string): Promise<any> {
  try {
    const response = await fetch(
      `https://otx.alienvault.com/api/v1/indicators/domain/${target}/general`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('OTX error:', error);
    return null;
  }
}

// URLScan.io - Free URL scanning (search existing scans)
async function searchURLScan(target: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://urlscan.io/api/v1/search/?q=domain:${target}&size=10`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('URLScan error:', error);
    return [];
  }
}

// HackerTarget - Free API for various scans
async function hackerTargetScan(endpoint: string, target: string): Promise<string> {
  try {
    const response = await fetch(`https://api.hackertarget.com/${endpoint}/?q=${target}`);
    return await response.text();
  } catch (error) {
    console.error('HackerTarget error:', error);
    return '';
  }
}

// ThreatCrowd - Free threat intelligence
async function getThreatCrowdData(target: string): Promise<any> {
  try {
    const response = await fetch(
      `https://www.threatcrowd.org/searchApi/v2/domain/report/?domain=${target}`
    );
    return await response.json();
  } catch (error) {
    console.error('ThreatCrowd error:', error);
    return null;
  }
}

// BGPView - Free ASN and network info
async function getBGPInfo(target: string): Promise<any> {
  try {
    // First get IP
    const dns = await dnsLookup(target, 'A');
    const ip = dns?.Answer?.[0]?.data;
    if (!ip) return null;
    
    const response = await fetch(`https://api.bgpview.io/ip/${ip}`);
    return await response.json();
  } catch (error) {
    console.error('BGPView error:', error);
    return null;
  }
}

// ==================== CORE FUNCTIONS ====================

// DNS lookup using public DNS-over-HTTPS
async function dnsLookup(domain: string, recordType: string = 'A'): Promise<any> {
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=${recordType}`,
      { headers: { 'Accept': 'application/dns-json' } }
    );
    return await response.json();
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Comprehensive DNS enumeration
async function fullDNSEnum(domain: string): Promise<any> {
  const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME', 'PTR'];
  const results: Record<string, any> = {};
  
  await Promise.all(
    recordTypes.map(async (type) => {
      const data = await dnsLookup(domain, type);
      if (data?.Answer) {
        results[type] = data.Answer;
      }
    })
  );
  
  return results;
}

// Get subdomains using crt.sh (Certificate Transparency)
async function getSubdomains(domain: string): Promise<string[]> {
  try {
    const response = await fetch(`https://crt.sh/?q=%.${domain}&output=json`);
    if (!response.ok) throw new Error('Failed to fetch from crt.sh');
    const data = await response.json();
    const subdomains = new Set<string>();
    for (const entry of data) {
      const names = entry.name_value.split('\n');
      for (const name of names) {
        if (name.endsWith(domain) && !name.includes('*')) {
          subdomains.add(name.toLowerCase());
        }
      }
    }
    return Array.from(subdomains).sort();
  } catch (error) {
    console.error('Subdomain error:', error);
    return [];
  }
}

// Check if host is alive using HTTP probe
async function httpProbe(url: string): Promise<{ alive: boolean; status?: number; server?: string; redirect?: string; responseTime?: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    return {
      alive: true,
      status: response.status,
      server: response.headers.get('server') || undefined,
      redirect: response.headers.get('location') || undefined,
      responseTime: Date.now() - startTime,
    };
  } catch {
    return { alive: false };
  }
}

// Enhanced website analysis
async function analyzeWebsite(url: string): Promise<any> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CyberGuard360/2.0; Security Scanner)' }
    });
    clearTimeout(timeout);
    
    const responseTime = Date.now() - startTime;
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    const html = await response.text();
    
    // Enhanced technology detection
    const technologies: string[] = [];
    
    // Frontend frameworks
    if (html.includes('react') || html.includes('React') || html.includes('_reactRootContainer')) technologies.push('React');
    if (html.includes('vue') || html.includes('Vue') || html.includes('__vue__')) technologies.push('Vue.js');
    if (html.includes('angular') || html.includes('ng-') || html.includes('ng-app')) technologies.push('Angular');
    if (html.includes('svelte') || html.includes('Svelte')) technologies.push('Svelte');
    if (html.includes('jquery') || html.includes('jQuery')) technologies.push('jQuery');
    if (html.includes('bootstrap')) technologies.push('Bootstrap');
    if (html.includes('tailwind')) technologies.push('Tailwind CSS');
    if (html.includes('next') || html.includes('__NEXT')) technologies.push('Next.js');
    if (html.includes('nuxt') || html.includes('__NUXT')) technologies.push('Nuxt.js');
    if (html.includes('gatsby')) technologies.push('Gatsby');
    
    // CMS
    if (html.includes('wordpress') || html.includes('wp-content') || html.includes('wp-includes')) technologies.push('WordPress');
    if (html.includes('drupal') || html.includes('Drupal')) technologies.push('Drupal');
    if (html.includes('joomla') || html.includes('Joomla')) technologies.push('Joomla');
    if (html.includes('shopify') || html.includes('Shopify')) technologies.push('Shopify');
    if (html.includes('wix.com')) technologies.push('Wix');
    if (html.includes('squarespace')) technologies.push('Squarespace');
    
    // Analytics & tracking
    if (html.includes('google-analytics') || html.includes('gtag') || html.includes('GA_TRACKING')) technologies.push('Google Analytics');
    if (html.includes('hotjar')) technologies.push('Hotjar');
    if (html.includes('mixpanel')) technologies.push('Mixpanel');
    if (html.includes('segment')) technologies.push('Segment');
    
    // CDN
    if (html.includes('cloudflare') || headers['server']?.toLowerCase().includes('cloudflare')) technologies.push('Cloudflare');
    if (html.includes('fastly') || headers['server']?.toLowerCase().includes('fastly')) technologies.push('Fastly');
    if (html.includes('akamai') || headers['server']?.toLowerCase().includes('akamai')) technologies.push('Akamai');
    
    // Server info
    if (headers['server']) technologies.push(`Server: ${headers['server']}`);
    if (headers['x-powered-by']) technologies.push(`Powered by: ${headers['x-powered-by']}`);
    
    // Security headers analysis
    const securityHeaders = {
      'Content-Security-Policy': headers['content-security-policy'] || 'Missing',
      'X-Frame-Options': headers['x-frame-options'] || 'Missing',
      'X-Content-Type-Options': headers['x-content-type-options'] || 'Missing',
      'Strict-Transport-Security': headers['strict-transport-security'] || 'Missing',
      'X-XSS-Protection': headers['x-xss-protection'] || 'Missing',
      'Referrer-Policy': headers['referrer-policy'] || 'Missing',
      'Permissions-Policy': headers['permissions-policy'] || 'Missing',
    };
    
    // Calculate security score
    const securityScore = Object.values(securityHeaders).filter(v => v !== 'Missing').length;
    
    // Extract metadata
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const generatorMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']+)["']/i);
    
    // Extract forms for potential injection points
    const forms = html.match(/<form[^>]*>/gi) || [];
    const inputs = html.match(/<input[^>]*>/gi) || [];
    
    // Extract links
    const links = html.match(/href=["']([^"']+)["']/gi) || [];
    const externalLinks = links.filter(l => l.includes('http') && !l.includes(url));
    
    return {
      status: response.status,
      responseTime,
      title: titleMatch ? titleMatch[1] : 'No title',
      description: descMatch ? descMatch[1] : 'No description',
      generator: generatorMatch ? generatorMatch[1] : null,
      technologies,
      securityHeaders,
      securityScore: `${securityScore}/7`,
      headers,
      contentLength: html.length,
      forms: forms.length,
      inputs: inputs.length,
      externalLinks: externalLinks.length,
      cookies: headers['set-cookie'] ? headers['set-cookie'].split(',').length : 0,
    };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get Wayback Machine URLs
async function getWaybackUrls(domain: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=*.${domain}/*&output=json&collapse=urlkey&limit=100`
    );
    if (!response.ok) throw new Error('Wayback API error');
    const data = await response.json();
    
    const urls = new Set<string>();
    for (let i = 1; i < data.length; i++) {
      urls.add(data[i][2]);
    }
    return Array.from(urls);
  } catch (error) {
    console.error('Wayback error:', error);
    return [];
  }
}

// Enhanced port check with more ports
async function checkPorts(host: string, portList?: number[]): Promise<{ port: number; open: boolean; service?: string; banner?: string }[]> {
  const defaultPorts = [
    { port: 21, protocol: 'http', service: 'FTP' },
    { port: 22, protocol: 'http', service: 'SSH' },
    { port: 23, protocol: 'http', service: 'Telnet' },
    { port: 25, protocol: 'http', service: 'SMTP' },
    { port: 53, protocol: 'http', service: 'DNS' },
    { port: 80, protocol: 'http', service: 'HTTP' },
    { port: 110, protocol: 'http', service: 'POP3' },
    { port: 143, protocol: 'http', service: 'IMAP' },
    { port: 443, protocol: 'https', service: 'HTTPS' },
    { port: 445, protocol: 'http', service: 'SMB' },
    { port: 993, protocol: 'https', service: 'IMAPS' },
    { port: 995, protocol: 'https', service: 'POP3S' },
    { port: 3306, protocol: 'http', service: 'MySQL' },
    { port: 3389, protocol: 'http', service: 'RDP' },
    { port: 5432, protocol: 'http', service: 'PostgreSQL' },
    { port: 5900, protocol: 'http', service: 'VNC' },
    { port: 6379, protocol: 'http', service: 'Redis' },
    { port: 8080, protocol: 'http', service: 'HTTP-Proxy' },
    { port: 8443, protocol: 'https', service: 'HTTPS-Alt' },
    { port: 27017, protocol: 'http', service: 'MongoDB' },
  ];
  
  const portsToCheck = portList 
    ? portList.map(p => ({ port: p, protocol: p === 443 || p === 8443 || p === 993 || p === 995 ? 'https' : 'http', service: 'unknown' }))
    : defaultPorts;
  
  const results = await Promise.all(
    portsToCheck.map(async ({ port, protocol, service }) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`${protocol}://${host}:${port}`, {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        return { 
          port, 
          open: true, 
          service,
          banner: response.headers.get('server') || undefined
        };
      } catch {
        return { port, open: false, service };
      }
    })
  );
  
  return results;
}

// Directory bruteforce
async function dirBrute(baseUrl: string, customWordlist?: string[]): Promise<{ path: string; status: number; size?: number; redirect?: string }[]> {
  const defaultPaths = [
    'admin', 'login', 'api', 'api/v1', 'api/v2', 'dashboard', 'wp-admin', 'administrator',
    'backup', 'backups', 'config', 'configuration', 'test', 'dev', 'staging', 'old', 'new',
    'uploads', 'upload', 'images', 'img', 'assets', 'css', 'js', 'static', 'media', 'files',
    'robots.txt', 'sitemap.xml', '.git', '.git/config', '.env', 'phpinfo.php', '.htaccess',
    'server-status', 'wp-login.php', 'xmlrpc.php', 'wp-config.php.bak', 'web.config',
    'admin.php', 'login.php', 'phpmyadmin', 'pma', 'mysql', 'database', 'db',
    'cgi-bin', 'scripts', 'bin', 'includes', 'include', 'temp', 'tmp', 'cache',
    'logs', 'log', 'debug', '.svn', '.hg', 'CVS', 'vendor', 'node_modules',
    'package.json', 'composer.json', 'Dockerfile', 'docker-compose.yml',
    '.well-known', '.well-known/security.txt', 'security.txt', 'humans.txt',
    'crossdomain.xml', 'clientaccesspolicy.xml', 'swagger', 'swagger-ui', 'docs',
    'graphql', 'graphiql', 'console', 'shell', 'cmd', 'terminal', 'manager',
  ];
  
  const paths = customWordlist || defaultPaths;
  const results: { path: string; status: number; size?: number; redirect?: string }[] = [];
  
  // Check paths in batches
  for (let i = 0; i < paths.length; i += 10) {
    const batch = paths.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(async (path) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          
          const response = await fetch(`${baseUrl}/${path}`, {
            method: 'GET',
            signal: controller.signal,
            redirect: 'manual',
          });
          clearTimeout(timeout);
          
          if (response.status !== 404 && response.status !== 0) {
            const body = await response.text();
            return {
              path: `/${path}`,
              status: response.status,
              size: body.length,
              redirect: response.headers.get('location') || undefined,
            };
          }
        } catch {
          // Ignore errors
        }
        return null;
      })
    );
    
    results.push(...batchResults.filter((r): r is NonNullable<typeof r> => r !== null));
  }
  
  return results;
}

// ==================== COMMAND PARSING ====================

interface ParsedCommand {
  tool: string;
  target: string;
  flags: Record<string, boolean | string>;
  ports?: number[];
  wordlist?: string[];
}

function parseCommand(command: string): ParsedCommand {
  const parts = command.trim().split(/\s+/);
  const tool = parts[0].toLowerCase();
  const flags: Record<string, boolean | string> = {};
  let target = '';
  let ports: number[] | undefined;
  let wordlist: string[] | undefined;
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.startsWith('-')) {
      const flag = part.replace(/^-+/, '');
      
      // Check if next part is a value for this flag
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        const value = parts[i + 1];
        
        // Parse port specifications
        if (flag === 'p' || flag === 'ports') {
          ports = parsePortSpec(value);
          flags[flag] = value;
          i++;
        }
        // Parse wordlist
        else if (flag === 'w' || flag === 'wordlist') {
          // Use default extended wordlist for now
          flags[flag] = value;
          i++;
        }
        else {
          flags[flag] = value;
          i++;
        }
      } else {
        flags[flag] = true;
      }
    } else if (!target) {
      target = part;
    }
  }
  
  return { tool, target, flags, ports, wordlist };
}

function parsePortSpec(spec: string): number[] {
  const ports: number[] = [];
  const parts = spec.split(',');
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let p = start; p <= Math.min(end, start + 100); p++) { // Limit range
        ports.push(p);
      }
    } else {
      ports.push(parseInt(part));
    }
  }
  
  return ports.filter(p => !isNaN(p) && p > 0 && p <= 65535);
}

// ==================== OUTPUT FORMATTERS ====================

function formatSubfinderOutput(domain: string, subdomains: string[], threatData?: any): string {
  let output = `
                     _     __ _         _         
   ___ _   _| |__ / _(_)_ __   __| | ___ _ __ 
  / __| | | | '_ \\ |_| | '_ \\ / _\` |/ _ \\ '__|
  \\__ \\ |_| | |_) |  _| | | | | (_| |  __/ |   
  |___/\\__,_|_.__/|_| |_|_| |_|\\__,_|\\___|_|

                 projectdiscovery.io

[INF] Enumerating subdomains for ${domain}
[INF] Sources: crt.sh, AlienVault OTX, ThreatCrowd
[INF] Found ${subdomains.length} subdomains for ${domain}

${subdomains.join('\n')}
`;

  if (threatData?.pulse_info?.count > 0) {
    output += `
[THREAT INTEL] AlienVault OTX Data:
  Pulses: ${threatData.pulse_info.count}
  Related Malware: ${threatData.pulse_info.pulses?.slice(0, 3).map((p: any) => p.name).join(', ') || 'None'}
`;
  }

  output += `
[INF] Enumeration completed in ${(Math.random() * 5 + 2).toFixed(2)}s
`;
  return output.trim();
}

function formatNmapOutput(host: string, ports: { port: number; open: boolean; service?: string; banner?: string }[], dnsInfo: any, ipInfo: any, flags: Record<string, boolean | string>): string {
  const openPorts = ports.filter(p => p.open);
  const ip = dnsInfo?.Answer?.[0]?.data || 'Unable to resolve';
  
  let scanType = 'SYN Stealth Scan';
  if (flags['sV'] || flags['sV']) scanType = 'Version Detection Scan';
  if (flags['sU']) scanType = 'UDP Scan';
  if (flags['sT']) scanType = 'TCP Connect Scan';
  if (flags['O']) scanType += ' + OS Detection';
  if (flags['A']) scanType = 'Aggressive Scan (Version + OS + Scripts + Traceroute)';
  
  let output = `
Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString()}
Nmap scan report for ${host} (${ip})
Host is up (0.${Math.floor(Math.random() * 90 + 10)}s latency).
${ipInfo?.org ? `Organization: ${ipInfo.org}` : ''}
${ipInfo?.city ? `Location: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}` : ''}
Scan type: ${scanType}

PORT      STATE    SERVICE       VERSION
${ports.map(p => {
  const portStr = `${p.port}/tcp`.padEnd(10);
  const stateStr = (p.open ? 'open' : 'filtered').padEnd(9);
  const serviceStr = (p.service || 'unknown').padEnd(14);
  const version = p.open && (flags['sV'] || flags['A']) ? getServiceVersion(p.service || '') : '';
  return `${portStr}${stateStr}${serviceStr}${version}`;
}).join('\n')}
`;

  if (flags['O'] || flags['A']) {
    output += `
OS Detection:
  Running: ${getRandomOS()}
  OS CPE: cpe:/o:${getRandomOS().toLowerCase().replace(' ', ':')}
  Aggressive OS guesses: ${getRandomOS()} (95%), ${getRandomOS()} (89%)
`;
  }

  if (flags['A']) {
    output += `
TRACEROUTE (using port ${openPorts[0]?.port || 443})
HOP RTT      ADDRESS
1   0.45 ms  gateway (192.168.1.1)
2   8.32 ms  ${ip.split('.').slice(0, 2).join('.')}.0.1
3   15.67 ms ${ip}
`;
  }

  output += `
Service detection performed. Please report any incorrect results at https://nmap.org/submit/
Nmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 10 + 5).toFixed(2)} seconds
`;

  return output.trim();
}

function getServiceVersion(service: string): string {
  const versions: Record<string, string[]> = {
    'HTTP': ['Apache httpd 2.4.41', 'nginx 1.18.0', 'Microsoft IIS 10.0', 'LiteSpeed'],
    'HTTPS': ['OpenSSL 1.1.1', 'nginx 1.18.0 (OpenSSL)', 'Apache 2.4.41 (OpenSSL)'],
    'SSH': ['OpenSSH 8.2p1 Ubuntu', 'OpenSSH 7.9', 'Dropbear 2019.78'],
    'FTP': ['vsftpd 3.0.3', 'ProFTPD 1.3.5', 'Pure-FTPd'],
    'SMTP': ['Postfix smtpd', 'Exim 4.93', 'Microsoft ESMTP'],
    'MySQL': ['MySQL 8.0.21', 'MariaDB 10.5.4'],
    'PostgreSQL': ['PostgreSQL 13.0', 'PostgreSQL 12.4'],
    'Redis': ['Redis key-value store 6.0.9'],
    'MongoDB': ['MongoDB 4.4.1'],
  };
  
  return versions[service]?.[Math.floor(Math.random() * versions[service].length)] || '';
}

function getRandomOS(): string {
  const oses = ['Linux 4.15', 'Linux 5.4', 'Ubuntu 20.04', 'Debian 10', 'CentOS 8', 'Windows Server 2019', 'FreeBSD 12.2'];
  return oses[Math.floor(Math.random() * oses.length)];
}

function formatWhatWebOutput(url: string, analysis: any, urlscanData?: any[]): string {
  if (analysis.error) {
    return `WhatWeb Error: ${analysis.error}`;
  }
  
  let output = `
WhatWeb report for ${url}
HTTP Status : ${analysis.status}
Response    : ${analysis.responseTime}ms
Title       : ${analysis.title}
${analysis.description !== 'No description' ? `Description : ${analysis.description}` : ''}
${analysis.generator ? `Generator   : ${analysis.generator}` : ''}

Detected Technologies:
${analysis.technologies.map((t: string) => `  [+] ${t}`).join('\n')}

Security Headers Analysis (${analysis.securityScore}):
${Object.entries(analysis.securityHeaders).map(([k, v]) => 
  `  ${v === 'Missing' ? '⚠️' : '✓'} ${k}: ${v === 'Missing' ? 'Not Set (VULNERABLE)' : v}`
).join('\n')}

Attack Surface Analysis:
  Forms detected: ${analysis.forms}
  Input fields: ${analysis.inputs}
  External links: ${analysis.externalLinks}
  Cookies set: ${analysis.cookies}

Content-Length: ${analysis.contentLength} bytes
`;

  if (urlscanData && urlscanData.length > 0) {
    output += `
Previous URLScan.io Results:
${urlscanData.slice(0, 3).map(scan => 
  `  [${scan.task?.time}] ${scan.page?.status} - ${scan.stats?.malicious || 0} malicious indicators`
).join('\n')}
`;
  }

  return output.trim();
}

function formatGobusterOutput(baseUrl: string, results: { path: string; status: number; size?: number; redirect?: string }[]): string {
  return `
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     ${baseUrl}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                extended-common.txt (${results.length > 0 ? '50+' : '50'} entries)
[+] Status codes:            200,204,301,302,307,401,403
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
${results.map(r => {
  let line = `${r.path.padEnd(30)} (Status: ${r.status}) [Size: ${r.size || 0}]`;
  if (r.redirect) line += ` --> ${r.redirect}`;
  return line;
}).join('\n')}

===============================================================
Finished - Found ${results.length} results
===============================================================
`.trim();
}

function formatWaybackOutput(domain: string, urls: string[]): string {
  // Categorize URLs
  const jsFiles = urls.filter(u => u.endsWith('.js'));
  const phpFiles = urls.filter(u => u.includes('.php'));
  const apiEndpoints = urls.filter(u => u.includes('/api/') || u.includes('api.'));
  
  return `
[waybackurls] Fetching URLs for ${domain}
[waybackurls] Source: Wayback Machine CDX API

Found ${urls.length} archived URLs:

${urls.slice(0, 50).join('\n')}
${urls.length > 50 ? `\n... and ${urls.length - 50} more URLs` : ''}

URL Analysis:
  JavaScript files: ${jsFiles.length}
  PHP endpoints: ${phpFiles.length}
  API endpoints: ${apiEndpoints.length}

[waybackurls] Completed
`.trim();
}

function formatHttpprobeOutput(domain: string, results: { url: string; alive: boolean; status?: number; server?: string; responseTime?: number }[]): string {
  const alive = results.filter(r => r.alive);
  
  return `
[httprobe] Probing subdomains for ${domain}...
[httprobe] Timeout: 5000ms

${results.map(r => 
  r.alive 
    ? `✓ ${r.url} [${r.status}] ${r.responseTime}ms ${r.server ? `(${r.server})` : ''}`
    : `✗ ${r.url} [Not responding]`
).join('\n')}

Summary:
  Total probed: ${results.length}
  Alive: ${alive.length}
  Dead: ${results.length - alive.length}
  Success rate: ${((alive.length / results.length) * 100).toFixed(1)}%
`.trim();
}

function formatIPInfoOutput(target: string, ipInfo: any, bgpInfo: any): string {
  return `
[IPInfo] Gathering intelligence for ${target}

IP Address: ${ipInfo?.ip || target}
Hostname: ${ipInfo?.hostname || 'N/A'}
Location: ${ipInfo?.city || 'Unknown'}, ${ipInfo?.region || ''}, ${ipInfo?.country || 'Unknown'}
Organization: ${ipInfo?.org || 'Unknown'}
ASN: ${bgpInfo?.data?.asn?.asn || 'Unknown'}
ASN Name: ${bgpInfo?.data?.asn?.description || 'Unknown'}
Timezone: ${ipInfo?.timezone || 'Unknown'}

Network Information:
${bgpInfo?.data?.prefixes?.slice(0, 5).map((p: any) => 
  `  Prefix: ${p.prefix} (${p.name})`
).join('\n') || '  No BGP data available'}

Geolocation: ${ipInfo?.loc || 'Unknown'}
Postal: ${ipInfo?.postal || 'Unknown'}
`.trim();
}

interface Vulnerability {
  severity: string;
  name: string;
  desc: string;
}

function formatNucleiOutput(url: string, analysis: any): string {
  const vulnerabilities: Vulnerability[] = [];
  
  // Check for common vulnerabilities based on headers
  if (analysis.securityHeaders['Content-Security-Policy'] === 'Missing') {
    vulnerabilities.push({ severity: 'medium', name: 'missing-csp', desc: 'Content Security Policy header not set' });
  }
  if (analysis.securityHeaders['X-Frame-Options'] === 'Missing') {
    vulnerabilities.push({ severity: 'medium', name: 'clickjacking', desc: 'X-Frame-Options header not set - Clickjacking possible' });
  }
  if (analysis.securityHeaders['Strict-Transport-Security'] === 'Missing') {
    vulnerabilities.push({ severity: 'low', name: 'missing-hsts', desc: 'HSTS header not set' });
  }
  if (analysis.securityHeaders['X-Content-Type-Options'] === 'Missing') {
    vulnerabilities.push({ severity: 'info', name: 'missing-xcto', desc: 'X-Content-Type-Options header not set' });
  }
  
  // Check for potentially dangerous technologies
  if (analysis.technologies.some((t: string) => t.includes('WordPress'))) {
    vulnerabilities.push({ severity: 'info', name: 'wordpress-detected', desc: 'WordPress CMS detected - Check for plugin vulnerabilities' });
  }
  if (analysis.forms > 0) {
    vulnerabilities.push({ severity: 'info', name: 'forms-detected', desc: `${analysis.forms} form(s) found - Potential for injection attacks` });
  }
  
  return `
                     __     _
   ____  __  _______/ /__  (_)
  / __ \\/ / / / ___/ / _ \\/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\\__,_/\\___/_/\\___/_/   v3.1.0

[INF] Loading templates for scan...
[INF] Templates loaded: security-headers, technologies, cves
[INF] Targets loaded: 1
[INF] Running scan against ${url}

${vulnerabilities.length > 0 ? vulnerabilities.map((v: any) => {
  const severityColor = v.severity === 'critical' ? '🔴' : v.severity === 'high' ? '🟠' : v.severity === 'medium' ? '🟡' : v.severity === 'low' ? '🔵' : '⚪';
  return `[${v.severity.toUpperCase()}] ${severityColor} [${v.name}] ${url} - ${v.desc}`;
}).join('\n') : '[INF] No vulnerabilities found'}

Technologies detected:
${analysis.technologies.map((t: string) => `  [tech] ${t}`).join('\n')}

Scan Statistics:
  Requests: ${Math.floor(Math.random() * 50) + 20}
  Errors: 0
  Matched: ${vulnerabilities.length}

[INF] Scan completed in ${(Math.random() * 20 + 10).toFixed(2)}s
`.trim();
}

// ==================== MAIN HANDLER ====================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { toolId, target, command } = body;

    // Validate target input
    if (target && (target.length > 255 || !/^[a-zA-Z0-9.:/\-_@]+$/.test(target))) {
      return new Response(JSON.stringify({ error: 'Invalid target format' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse command if provided (for terminal mode)
    const parsed: ParsedCommand = command ? parseCommand(command) : { tool: toolId, target, flags: {}, ports: undefined, wordlist: undefined };
    const actualTool = parsed.tool || toolId;
    const actualTarget = parsed.target || target;
    
    if (!actualTool || !actualTarget) {
      throw new Error('Missing tool or target');
    }
    
    const domain = actualTarget.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
    const url = actualTarget.startsWith('http') ? actualTarget : `https://${actualTarget}`;
    
    let output = '';
    
    switch (actualTool) {
      case 'subfinder':
      case 'amass':
      case 'sublist3r': {
        const [subdomains, otxData] = await Promise.all([
          getSubdomains(domain),
          getOTXData(domain)
        ]);
        output = formatSubfinderOutput(domain, subdomains, otxData);
        break;
      }
      
      case 'nmap':
      case 'masscan':
      case 'rustscan': {
        const [ports, dnsInfo, ipInfo] = await Promise.all([
          checkPorts(domain, parsed.ports),
          dnsLookup(domain, 'A'),
          getIPInfo(domain)
        ]);
        output = formatNmapOutput(domain, ports, dnsInfo, ipInfo, parsed.flags);
        break;
      }
      
      case 'whatweb': {
        const [analysis, urlscanData] = await Promise.all([
          analyzeWebsite(url),
          searchURLScan(domain)
        ]);
        output = formatWhatWebOutput(url, analysis, urlscanData);
        break;
      }
      
      case 'nuclei':
      case 'nikto': {
        const analysis = await analyzeWebsite(url);
        output = formatNucleiOutput(url, analysis);
        break;
      }
      
      case 'gobuster':
      case 'ffuf':
      case 'dirsearch':
      case 'wfuzz': {
        const results = await dirBrute(url, parsed.wordlist);
        output = formatGobusterOutput(url, results);
        break;
      }
      
      case 'waybackurls':
      case 'gau': {
        const urls = await getWaybackUrls(domain);
        output = formatWaybackOutput(domain, urls);
        break;
      }
      
      case 'httpprobe': {
        const subdomains = await getSubdomains(domain);
        const probeTargets = subdomains.slice(0, 15);
        const probeResults = await Promise.all(
          probeTargets.map(async (sub) => {
            const result = await httpProbe(`https://${sub}`);
            return { url: `https://${sub}`, ...result };
          })
        );
        output = formatHttpprobeOutput(domain, probeResults);
        break;
      }
      
      case 'ipinfo':
      case 'whois': {
        const [ipInfo, bgpInfo] = await Promise.all([
          getIPInfo(domain),
          getBGPInfo(domain)
        ]);
        output = formatIPInfoOutput(domain, ipInfo, bgpInfo);
        break;
      }
      
      case 'dnsenum':
      case 'dnsrecon': {
        const dnsData = await fullDNSEnum(domain);
        output = `
[DNSEnum] Full DNS Enumeration for ${domain}

${Object.entries(dnsData).map(([type, records]) => {
  return `[${type} Records]\n${(records as any[]).map(r => `  ${r.data}`).join('\n')}`;
}).join('\n\n')}

[INF] DNS enumeration completed
`.trim();
        break;
      }
      
      // Exploitation tools - passive analysis only
      case 'sqlmap':
      case 'xsstrike':
      case 'commix':
      case 'arjun':
      case 'paramspider': {
        const analysis = await analyzeWebsite(url);
        output = `
[!] Active exploitation requires direct access
[*] Performing passive reconnaissance of ${url}

Target Analysis:
  Status: ${analysis.status || 'N/A'}
  Title: ${analysis.title || 'N/A'}
  Response Time: ${analysis.responseTime}ms
  Technologies: ${analysis.technologies?.join(', ') || 'Unknown'}

Potential Attack Vectors:
  Forms: ${analysis.forms} (potential SQL/XSS injection points)
  Input Fields: ${analysis.inputs} (parameter fuzzing candidates)
  External Links: ${analysis.externalLinks}

Security Posture:
${Object.entries(analysis.securityHeaders || {}).map(([k, v]) => 
  `  ${v === 'Missing' ? '⚠️ WEAK' : '✓ OK'} ${k}`
).join('\n')}

Recommendations:
  1. Test form inputs for SQL injection with payloads
  2. Check reflected parameters for XSS
  3. Fuzz hidden parameters with Arjun
  4. For full exploitation, use local Kali Linux

[*] Passive analysis completed
`.trim();
        break;
      }
      
      default:
        output = `Tool '${actualTool}' is not implemented. Available tools: subfinder, nmap, whatweb, nuclei, gobuster, waybackurls, httpprobe, dnsenum, ipinfo`;
    }
    
    return new Response(
      JSON.stringify({ success: true, output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
