// Linux commands that can be simulated in the browser

export interface FileSystemNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: Record<string, FileSystemNode>;
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: Date;
}

// Virtual file system
export const virtualFS: FileSystemNode = {
  type: 'directory',
  name: '/',
  children: {
    'home': {
      type: 'directory',
      name: 'home',
      children: {
        'kali': {
          type: 'directory',
          name: 'kali',
          children: {
            'Desktop': { type: 'directory', name: 'Desktop', children: {} },
            'Documents': { type: 'directory', name: 'Documents', children: {} },
            'Downloads': { type: 'directory', name: 'Downloads', children: {} },
            'tools': {
              type: 'directory',
              name: 'tools',
              children: {
                'wordlists': {
                  type: 'directory',
                  name: 'wordlists',
                  children: {
                    'common.txt': { type: 'file', name: 'common.txt', content: 'admin\nlogin\napi\nbackup\nconfig\ntest\ndev\nuploads\nimages\nassets', size: 512 },
                    'directories.txt': { type: 'file', name: 'directories.txt', content: 'admin\nadministrator\nbackup\ncgi-bin\nconfig\ndb\ndev\nfiles\nimages\njs\ncss\napi\nv1\nv2', size: 1024 },
                  }
                },
                'payloads': {
                  type: 'directory',
                  name: 'payloads',
                  children: {
                    'sqli.txt': { type: 'file', name: 'sqli.txt', content: "' OR 1=1--\n\" OR 1=1--\n' OR 'a'='a\n1; DROP TABLE users--", size: 256 },
                    'xss.txt': { type: 'file', name: 'xss.txt', content: '<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n<svg onload=alert(1)>', size: 256 },
                  }
                },
              }
            },
            '.bashrc': { type: 'file', name: '.bashrc', content: '# Kali Linux .bashrc\nexport PATH=$PATH:~/tools\nalias ll="ls -la"\nalias cls="clear"', size: 128 },
            '.bash_history': { type: 'file', name: '.bash_history', content: 'nmap -sV scanme.nmap.org\nsubfinder -d example.com\ngobuster dir -u https://target.com -w wordlist.txt', size: 256 },
          }
        }
      }
    },
    'etc': {
      type: 'directory',
      name: 'etc',
      children: {
        'passwd': { type: 'file', name: 'passwd', content: 'root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:Kali,,,:/home/kali:/bin/bash', size: 128 },
        'hosts': { type: 'file', name: 'hosts', content: '127.0.0.1 localhost\n127.0.1.1 kali\n::1 localhost ip6-localhost ip6-loopback', size: 96 },
        'resolv.conf': { type: 'file', name: 'resolv.conf', content: 'nameserver 8.8.8.8\nnameserver 8.8.4.4', size: 48 },
      }
    },
    'usr': {
      type: 'directory',
      name: 'usr',
      children: {
        'bin': { type: 'directory', name: 'bin', children: {} },
        'share': {
          type: 'directory',
          name: 'share',
          children: {
            'wordlists': {
              type: 'directory',
              name: 'wordlists',
              children: {
                'rockyou.txt': { type: 'file', name: 'rockyou.txt', content: '[Large password wordlist - 14 million passwords]', size: 139921497 },
                'dirb': { type: 'directory', name: 'dirb', children: {} },
                'dirbuster': { type: 'directory', name: 'dirbuster', children: {} },
                'seclists': { type: 'directory', name: 'seclists', children: {} },
              }
            }
          }
        }
      }
    },
    'var': {
      type: 'directory',
      name: 'var',
      children: {
        'log': {
          type: 'directory',
          name: 'log',
          children: {
            'auth.log': { type: 'file', name: 'auth.log', content: 'Authentication logs...', size: 4096 },
            'syslog': { type: 'file', name: 'syslog', content: 'System logs...', size: 8192 },
          }
        },
        'www': {
          type: 'directory',
          name: 'www',
          children: {
            'html': { type: 'directory', name: 'html', children: {} }
          }
        }
      }
    },
    'tmp': { type: 'directory', name: 'tmp', children: {} },
    'root': { type: 'directory', name: 'root', children: {} },
  }
};

// Get node at path
export function getNode(path: string, fs: FileSystemNode = virtualFS): FileSystemNode | null {
  if (path === '/' || path === '') return fs;
  
  const parts = path.split('/').filter(p => p !== '');
  let current = fs;
  
  for (const part of parts) {
    if (part === '..') {
      // Handle parent - simplified for now
      continue;
    }
    if (part === '.') continue;
    if (!current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }
  
  return current;
}

// Resolve path (handle ~, .., .)
export function resolvePath(path: string, currentDir: string): string {
  if (path.startsWith('~')) {
    path = '/home/kali' + path.slice(1);
  }
  
  if (!path.startsWith('/')) {
    path = currentDir + '/' + path;
  }
  
  const parts = path.split('/').filter(p => p !== '' && p !== '.');
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return '/' + resolved.join('/');
}

// Format file size
export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + 'M';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'G';
}

// Linux command implementations
export const linuxCommands: Record<string, (args: string[], currentDir: string, setDir: (dir: string) => void) => string> = {
  pwd: (args, currentDir) => currentDir,
  
  whoami: () => 'kali',
  
  id: () => 'uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),44(video),109(netdev)',
  
  hostname: () => 'kali',
  
  uname: (args) => {
    if (args.includes('-a')) {
      return 'Linux kali 6.1.0-kali7-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.20-1kali1 x86_64 GNU/Linux';
    }
    if (args.includes('-r')) return '6.1.0-kali7-amd64';
    if (args.includes('-m')) return 'x86_64';
    return 'Linux';
  },
  
  date: () => new Date().toString(),
  
  uptime: () => ` ${new Date().toLocaleTimeString()}  up 2 days, 14:32,  1 user,  load average: 0.52, 0.58, 0.59`,
  
  free: (args) => {
    const showHuman = args.includes('-h');
    if (showHuman) {
      return `              total        used        free      shared  buff/cache   available
Mem:           15Gi       4.2Gi       8.1Gi       312Mi       2.8Gi        10Gi
Swap:         2.0Gi          0B       2.0Gi`;
    }
    return `              total        used        free      shared  buff/cache   available
Mem:       16384000     4300000     8300000      320000     2900000    10500000
Swap:       2097152           0     2097152`;
  },
  
  df: (args) => {
    const showHuman = args.includes('-h');
    if (showHuman) {
      return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       234G   45G  177G  21% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/sda2       466G  120G  322G  28% /home`;
    }
    return `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1      245101684  47185920 185395412  21% /
tmpfs            8166656         0   8166656   0% /dev/shm
/dev/sda2      488378624 125829120 337583104  28% /home`;
  },
  
  echo: (args) => args.join(' ').replace(/^["']|["']$/g, ''),
  
  cat: (args, currentDir) => {
    if (args.length === 0) return 'cat: missing file operand';
    const path = resolvePath(args[0], currentDir);
    const node = getNode(path);
    if (!node) return `cat: ${args[0]}: No such file or directory`;
    if (node.type === 'directory') return `cat: ${args[0]}: Is a directory`;
    return node.content || '';
  },
  
  ls: (args, currentDir) => {
    const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
    
    let targetPath = currentDir;
    const nonFlagArgs = args.filter(a => !a.startsWith('-'));
    if (nonFlagArgs.length > 0) {
      targetPath = resolvePath(nonFlagArgs[0], currentDir);
    }
    
    const node = getNode(targetPath);
    if (!node) return `ls: cannot access '${nonFlagArgs[0] || targetPath}': No such file or directory`;
    if (node.type === 'file') {
      if (showLong) {
        return `-rw-r--r-- 1 kali kali ${formatSize(node.size || 0).padStart(8)} Jan 15 12:00 ${node.name}`;
      }
      return node.name;
    }
    
    const entries = Object.keys(node.children || {}).sort();
    const allEntries = showAll ? ['.', '..', ...entries] : entries.filter(e => !e.startsWith('.'));
    
    if (showLong) {
      const lines = allEntries.map(name => {
        if (name === '.' || name === '..') {
          return `drwxr-xr-x 2 kali kali     4096 Jan 15 12:00 ${name}`;
        }
        const child = node.children![name];
        const type = child.type === 'directory' ? 'd' : '-';
        const perms = child.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
        const size = formatSize(child.size || 4096).padStart(8);
        const color = child.type === 'directory' ? '\x1b[1;34m' : '';
        const reset = child.type === 'directory' ? '\x1b[0m' : '';
        return `${type}${perms} 1 kali kali ${size} Jan 15 12:00 ${name}`;
      });
      return `total ${allEntries.length * 4}\n${lines.join('\n')}`;
    }
    
    return allEntries.join('  ');
  },
  
  cd: (args, currentDir, setDir) => {
    if (args.length === 0 || args[0] === '~') {
      setDir('/home/kali');
      return '';
    }
    
    const newPath = resolvePath(args[0], currentDir);
    const node = getNode(newPath);
    
    if (!node) return `bash: cd: ${args[0]}: No such file or directory`;
    if (node.type !== 'directory') return `bash: cd: ${args[0]}: Not a directory`;
    
    setDir(newPath);
    return '';
  },
  
  mkdir: (args, currentDir) => {
    if (args.length === 0) return 'mkdir: missing operand';
    return ''; // Silent success in simulation
  },
  
  touch: (args, currentDir) => {
    if (args.length === 0) return 'touch: missing file operand';
    return ''; // Silent success
  },
  
  rm: (args, currentDir) => {
    if (args.length === 0) return 'rm: missing operand';
    return ''; // Silent success
  },
  
  cp: (args) => {
    if (args.length < 2) return 'cp: missing file operand';
    return '';
  },
  
  mv: (args) => {
    if (args.length < 2) return 'mv: missing file operand';
    return '';
  },
  
  grep: (args, currentDir) => {
    if (args.length < 2) return 'Usage: grep PATTERN [FILE...]';
    const pattern = args[0];
    const filePath = resolvePath(args[1], currentDir);
    const node = getNode(filePath);
    if (!node || node.type !== 'file') return `grep: ${args[1]}: No such file or directory`;
    const lines = (node.content || '').split('\n');
    return lines.filter(l => l.toLowerCase().includes(pattern.toLowerCase())).join('\n');
  },
  
  head: (args, currentDir) => {
    if (args.length === 0) return 'head: missing file operand';
    let n = 10;
    let file = args[0];
    if (args[0] === '-n' && args.length > 2) {
      n = parseInt(args[1]);
      file = args[2];
    }
    const path = resolvePath(file, currentDir);
    const node = getNode(path);
    if (!node || node.type !== 'file') return `head: cannot open '${file}' for reading: No such file or directory`;
    return (node.content || '').split('\n').slice(0, n).join('\n');
  },
  
  tail: (args, currentDir) => {
    if (args.length === 0) return 'tail: missing file operand';
    let n = 10;
    let file = args[0];
    if (args[0] === '-n' && args.length > 2) {
      n = parseInt(args[1]);
      file = args[2];
    }
    const path = resolvePath(file, currentDir);
    const node = getNode(path);
    if (!node || node.type !== 'file') return `tail: cannot open '${file}' for reading: No such file or directory`;
    const lines = (node.content || '').split('\n');
    return lines.slice(-n).join('\n');
  },
  
  wc: (args, currentDir) => {
    if (args.length === 0) return 'wc: missing file operand';
    const path = resolvePath(args[0], currentDir);
    const node = getNode(path);
    if (!node || node.type !== 'file') return `wc: ${args[0]}: No such file or directory`;
    const content = node.content || '';
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).filter(w => w).length;
    const chars = content.length;
    return `  ${lines}   ${words} ${chars} ${args[0]}`;
  },
  
  which: (args) => {
    if (args.length === 0) return '';
    const commands: Record<string, string> = {
      nmap: '/usr/bin/nmap',
      subfinder: '/usr/bin/subfinder',
      nuclei: '/usr/bin/nuclei',
      gobuster: '/usr/bin/gobuster',
      ffuf: '/usr/bin/ffuf',
      sqlmap: '/usr/bin/sqlmap',
      nikto: '/usr/bin/nikto',
      whatweb: '/usr/bin/whatweb',
      masscan: '/usr/bin/masscan',
      rustscan: '/usr/bin/rustscan',
      amass: '/usr/bin/amass',
      httpx: '/usr/bin/httpx',
      bash: '/usr/bin/bash',
      python: '/usr/bin/python3',
      python3: '/usr/bin/python3',
      perl: '/usr/bin/perl',
      ruby: '/usr/bin/ruby',
      curl: '/usr/bin/curl',
      wget: '/usr/bin/wget',
      git: '/usr/bin/git',
    };
    return commands[args[0]] || `${args[0]} not found`;
  },
  
  type: (args) => {
    if (args.length === 0) return '';
    const builtins = ['cd', 'pwd', 'echo', 'export', 'alias', 'exit', 'history', 'clear'];
    if (builtins.includes(args[0])) return `${args[0]} is a shell builtin`;
    const whichResult = linuxCommands.which(args, '', () => {});
    return whichResult;
  },
  
  env: () => `SHELL=/bin/bash
USER=kali
PWD=/home/kali
HOME=/home/kali
LANG=en_US.UTF-8
TERM=xterm-256color
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`,
  
  export: (args) => {
    if (args.length === 0) {
      const envResult = linuxCommands.env([], '', () => {});
      return envResult;
    }
    return '';
  },
  
  alias: () => `alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias cls='clear'
alias ..='cd ..'`,
  
  history: (args, currentDir) => {
    // This would be handled by the terminal component with actual history
    return '    1  nmap -sV scanme.nmap.org\n    2  subfinder -d example.com\n    3  ls -la\n    4  cd tools';
  },
  
  man: (args) => {
    if (args.length === 0) return 'What manual page do you want?';
    return `No manual entry for ${args[0]}\nTry: man -k ${args[0]}`;
  },
  
  ifconfig: () => `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::1  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:ab:cd:ef  txqueuelen 1000  (Ethernet)
        RX packets 123456  bytes 123456789 (117.7 MiB)
        TX packets 98765  bytes 12345678 (11.7 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`,
  
  ip: (args) => {
    if (args[0] === 'a' || args[0] === 'addr') {
      return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::1/64 scope link`;
    }
    if (args[0] === 'r' || args[0] === 'route') {
      return `default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100`;
    }
    return 'Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }';
  },
  
  ping: (args) => {
    if (args.length === 0) return 'ping: usage error: Destination address required';
    return `PING ${args[0]} (8.8.8.8) 56(84) bytes of data.
64 bytes from ${args[0]} (8.8.8.8): icmp_seq=1 ttl=117 time=14.2 ms
64 bytes from ${args[0]} (8.8.8.8): icmp_seq=2 ttl=117 time=13.8 ms
64 bytes from ${args[0]} (8.8.8.8): icmp_seq=3 ttl=117 time=14.5 ms

--- ${args[0]} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 13.800/14.167/14.500/0.289 ms`;
  },
  
  curl: (args) => {
    if (args.length === 0) return 'curl: try \'curl --help\' for more information';
    if (args.includes('-I') || args.includes('--head')) {
      return `HTTP/2 200 
server: nginx
date: ${new Date().toUTCString()}
content-type: text/html; charset=UTF-8
vary: Accept-Encoding
x-frame-options: SAMEORIGIN`;
    }
    return `<!DOCTYPE html>
<html>
<head><title>Example</title></head>
<body><h1>Example Domain</h1></body>
</html>`;
  },
  
  wget: (args) => {
    if (args.length === 0) return 'wget: missing URL';
    const url = args.find(a => !a.startsWith('-')) || 'index.html';
    const filename = url.split('/').pop() || 'index.html';
    return `--${new Date().toISOString()}--  ${url}
Resolving ${url}... 93.184.216.34
Connecting to ${url}|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1256 (1.2K) [text/html]
Saving to: '${filename}'

${filename}         100%[===================>]   1.23K  --.-KB/s    in 0s

${new Date().toISOString()} (12.3 MB/s) - '${filename}' saved [1256/1256]`;
  },
  
  ps: (args) => {
    if (args.includes('aux') || args.includes('-aux')) {
      return `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0 169584 13056 ?        Ss   Jan15   0:05 /sbin/init
root           2  0.0  0.0      0     0 ?        S    Jan15   0:00 [kthreadd]
kali        1234  0.1  0.2 123456 12345 pts/0    Ss   10:00   0:01 bash
kali        5678  0.0  0.1  98765  8765 pts/0    R+   12:00   0:00 ps aux`;
    }
    return `    PID TTY          TIME CMD
   1234 pts/0    00:00:01 bash
   5678 pts/0    00:00:00 ps`;
  },
  
  top: () => `top - ${new Date().toLocaleTimeString()} up 2 days, 14:32,  1 user,  load average: 0.52, 0.58, 0.59
Tasks: 234 total,   1 running, 233 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.2 us,  2.1 sy,  0.0 ni, 92.1 id,  0.5 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :  15924.2 total,   8234.5 free,   4321.8 used,   3367.9 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.  10567.2 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1234 kali      20   0  123456  12345   8765 R   5.2   0.1   0:01.23 bash`,
  
  netstat: (args) => {
    if (args.includes('-tulpn') || args.includes('-tuln')) {
      return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      5678/postgres
tcp6       0      0 :::80                   :::*                    LISTEN      9012/nginx`;
    }
    return `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 192.168.1.100:52234     8.8.8.8:443            ESTABLISHED`;
  },
  
  ss: () => `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp   LISTEN 0      128    0.0.0.0:22           0.0.0.0:*
tcp   LISTEN 0      128    0.0.0.0:80           0.0.0.0:*`,
  
  find: (args, currentDir) => {
    if (args.length === 0) return '.';
    return `./${args[0]}\n./dir/${args[0]}`;
  },
  
  locate: (args) => {
    if (args.length === 0) return 'locate: no pattern to search for specified';
    return `/usr/share/wordlists/${args[0]}
/home/kali/tools/${args[0]}`;
  },
  
  chmod: (args) => {
    if (args.length < 2) return 'chmod: missing operand';
    return '';
  },
  
  chown: (args) => {
    if (args.length < 2) return 'chown: missing operand';
    return '';
  },
  
  sudo: (args, currentDir, setDir) => {
    if (args.length === 0) return 'usage: sudo command';
    const cmd = args[0];
    const cmdArgs = args.slice(1);
    if (linuxCommands[cmd]) {
      return linuxCommands[cmd](cmdArgs, currentDir, setDir);
    }
    return `sudo: ${cmd}: command not found`;
  },
  
  apt: (args) => {
    if (args.length === 0) return 'apt 2.6.1 (amd64)';
    if (args[0] === 'update') {
      return `Hit:1 http://kali.download/kali kali-rolling InRelease
Reading package lists... Done
Building dependency tree... Done`;
    }
    if (args[0] === 'install') {
      if (args.length < 2) return 'E: No packages specified';
      return `Reading package lists... Done
Building dependency tree... Done
${args[1]} is already the newest version.
0 upgraded, 0 newly installed, 0 to remove.`;
    }
    return 'E: Invalid operation';
  },
  
  service: (args) => {
    if (args.length < 2) return 'Usage: service <service> <action>';
    return `${args[0]} ${args[1]} successfully`;
  },
  
  systemctl: (args) => {
    if (args.length < 2) return 'systemctl: missing command';
    return `● ${args[1]}.service - ${args[1].charAt(0).toUpperCase() + args[1].slice(1)} Service
   Loaded: loaded (/lib/systemd/system/${args[1]}.service; enabled)
   Active: active (running) since Mon 2024-01-15 10:00:00 UTC`;
  },
  
  base64: (args) => {
    if (args.length === 0) return '';
    if (args[0] === '-d' && args[1]) {
      try {
        return atob(args[1]);
      } catch {
        return 'base64: invalid input';
      }
    }
    return btoa(args.join(' '));
  },
  
  md5sum: (args) => {
    if (args.length === 0) return '';
    return `d41d8cd98f00b204e9800998ecf8427e  ${args[0]}`;
  },
  
  sha256sum: (args) => {
    if (args.length === 0) return '';
    return `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  ${args[0]}`;
  },
  
  file: (args, currentDir) => {
    if (args.length === 0) return 'Usage: file [-bcEhiklLNnprsvzZ0] [file ...]';
    const path = resolvePath(args[0], currentDir);
    const node = getNode(path);
    if (!node) return `${args[0]}: cannot open (No such file or directory)`;
    if (node.type === 'directory') return `${args[0]}: directory`;
    return `${args[0]}: ASCII text`;
  },
  
  xxd: (args, currentDir) => {
    if (args.length === 0) return '';
    return `00000000: 4865 6c6c 6f20 576f 726c 640a            Hello World.`;
  },
  
  strings: (args) => {
    if (args.length === 0) return '';
    return `strings output for ${args[0]}`;
  },
  
  clear: () => '__CLEAR__', // Special flag to clear terminal
  
  cls: () => '__CLEAR__',
  
  exit: () => 'logout',
  
  help: () => `Kali NetHunter Terminal - Available Commands:

NAVIGATION:
  cd, pwd, ls, tree, find, locate

FILE OPERATIONS:
  cat, head, tail, less, more, cp, mv, rm, mkdir, touch, chmod, chown

TEXT PROCESSING:
  grep, sed, awk, cut, sort, uniq, wc, diff

SYSTEM INFO:
  whoami, id, hostname, uname, uptime, date, free, df, ps, top

NETWORKING:
  ping, curl, wget, ifconfig, ip, netstat, ss, nc, nslookup, dig

SECURITY TOOLS:
  nmap, subfinder, nuclei, gobuster, ffuf, nikto, whatweb, sqlmap
  masscan, rustscan, amass, httpprobe, waybackurls, dnsenum

UTILITIES:
  echo, base64, md5sum, sha256sum, file, strings, xxd, which, type

Type '<command> --help' for detailed usage of each command.
Type 'tools' to list all available security tools.`,
};
