// Generate realistic tool outputs that mimic actual Kali Linux tools

export function generateRealisticOutput(toolId: string, target: string): string {
  const domain = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const timestamp = new Date().toISOString();
  
  const outputs: Record<string, () => string> = {
    subfinder: () => `
                     _     __ _         _         
   ___ _   _| |__ / _(_)_ __   __| | ___ _ __ 
  / __| | | | '_ \\ |_| | '_ \\ / _\` |/ _ \\ '__|
  \\__ \\ |_| | |_) |  _| | | | | (_| |  __/ |   
  |___/\\__,_|_.__/|_| |_|_| |_|\\__,_|\\___|_|

                 projectdiscovery.io

[INF] Enumerating subdomains for ${domain}
[INF] Using sources: alienvault,anubis,bevigil,binaryedge,bufferover,c99,censys,certspotter,chaos,chinaz,commoncrawl,crtsh,digitorus,dnsdumpster,dnsrepo,fofa,fullhunt,github,hackertarget,hunter,intelx,leakix,netlas,passivetotal,quake,rapiddns,redhuntlabs,robtex,securitytrails,shodan,sitedossier,threatminer,urlscan,virustotal,wayback,whoisxmlapi,zoomeye,zoomeyeapi
[INF] Found 23 subdomains for ${domain} in 4.2s
api.${domain}
www.${domain}
mail.${domain}
admin.${domain}
dev.${domain}
staging.${domain}
test.${domain}
cdn.${domain}
blog.${domain}
app.${domain}
portal.${domain}
dashboard.${domain}
auth.${domain}
login.${domain}
secure.${domain}
m.${domain}
mobile.${domain}
beta.${domain}
api-v2.${domain}
static.${domain}
assets.${domain}
img.${domain}
docs.${domain}
`.trim(),

    amass: () => `
        .+++:.            :                             .+++.
      +W@@@@@@8        &+W@#               o8telegramW@@@@@@#.   oW@@@W#+
     &@#+   .o@##.    .@@@o@W.o" "@@o]
    :@#   &WW@&+W@*=++@N@8@@@  8@@@  &W@@@@@@#-      -W@@@W8
    +@+  #&   +@@   W@@+:&W@W   W@@+  @@@@     +@@@W
    &@:  +&   #@:   W@@    &@W  W@&  8@@#      #@@@8
    #@: :@@W  &@&   W@#    &W@:W@@   W@@@      &@@@
    @Wo @8@W  @@@   W@#    :W@@@@   &W@@8      W@@8
    @W: :W@W  W@&   W@#     W@@     &@@        W@@#
    +@W  +@W  &@#   &@+     W@&     W@@        &@W
    #@@: :@@  W@@   #@&     @@@     &@@#      +W@+
    &@@W :@W  #@8   #@8     @@@     &@@8     +W@@
    :@@@W&@@  +@W   8@:     &@@     &@W@     +@@8
    +W@@@@@W  +@@   @8      W@8     W@@@+    +@@:
     &W@@@@+  +@@  :@#      @@o     &W@@8   &@W.
      #@@@W   &@+  .@8      W@#     :W@@#  :@W:
        +#&   &W:   +@      W@W      #@@*  #@+
                     +W     +W@      +@@+ :@:    
                                      &@* 
                                       &

OWASP Amass v3.23.3 - ${timestamp}
Config: default config
DNS: 8.8.8.8,8.8.4.4,1.1.1.1

Starting enumeration for ${domain}

${domain} (ASN: AS13335) - Cloudflare, Inc.
Discovered Names: 31

www.${domain}
api.${domain}
mail.${domain}
ftp.${domain}
webmail.${domain}
smtp.${domain}
pop.${domain}
ns1.${domain}
ns2.${domain}
vpn.${domain}
remote.${domain}
gateway.${domain}
proxy.${domain}
server.${domain}
host.${domain}
backup.${domain}
db.${domain}
mysql.${domain}
oracle.${domain}
postgresql.${domain}
dns.${domain}
mx.${domain}
exchange.${domain}
autodiscover.${domain}
lyncdiscover.${domain}
sip.${domain}
owa.${domain}
cpanel.${domain}
whm.${domain}
webdisk.${domain}
cpcalendars.${domain}

Enumeration finished in 12.4 seconds
`.trim(),

    nmap: () => {
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      return `
Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString()}
Nmap scan report for ${domain} (${ip})
Host is up (0.023s latency).
rDNS record for ${ip}: ${domain}

PORT      STATE    SERVICE        VERSION
21/tcp    filtered ftp
22/tcp    open     ssh            OpenSSH 8.9p1 Ubuntu 3ubuntu0.4
| ssh-hostkey: 
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
80/tcp    open     http           nginx 1.22.1
|_http-title: ${domain} - Welcome
|_http-server-header: nginx/1.22.1
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
443/tcp   open     ssl/http       nginx 1.22.1
|_http-title: ${domain} - Secure Portal
| ssl-cert: Subject: CN=${domain}
| Subject Alternative Name: DNS:${domain}, DNS:www.${domain}
| Issuer: C=US, O=Let's Encrypt, CN=R3
| Public Key type: ec
| Public Key bits: 256
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-01-15T00:00:00
| Not valid after:  2024-04-14T23:59:59
3306/tcp  filtered mysql
8080/tcp  open     http-proxy     
| http-methods: 
|_  Supported Methods: GET HEAD POST
8443/tcp  open     ssl/https-alt  
9090/tcp  filtered zeus-admin

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 18.42 seconds
`.trim();
    },

    sqlmap: () => `
        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ ${new Date().toLocaleTimeString()}

[INFO] testing connection to the target URL
[INFO] checking if the target is protected by some kind of WAF/IPS
[INFO] testing if the target URL content is stable
[INFO] target URL content is stable
[INFO] testing if GET parameter 'id' is dynamic
[INFO] GET parameter 'id' appears to be dynamic
[INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable (possible DBMS: 'MySQL')
[INFO] heuristic (XSS) test shows that GET parameter 'id' might be vulnerable to cross-site scripting (XSS) attacks
[INFO] testing for SQL injection on GET parameter 'id'
[INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[WARNING] reflective value(s) found and filtering out
[INFO] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable 
[INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'
[INFO] target URL appears to have 3 columns in query
[INFO] GET parameter 'id' is 'Generic UNION query (NULL) - 1 to 20 columns' injectable
GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] 

sqlmap identified the following injection point(s) with a total of 52 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 5735=5735

    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: id=-7158 UNION ALL SELECT NULL,CONCAT(0x717a767671,0x6b67754c6f6b,0x71786a6271),NULL-- -
---
[INFO] the back-end DBMS is MySQL
web application technology: Nginx 1.22.1, PHP 8.1.12
back-end DBMS: MySQL >= 5.0.12
[INFO] fetched data logged to text files under '/root/.sqlmap/output/${target}'

[*] ending @ ${new Date().toLocaleTimeString()}
`.trim(),

    nuclei: () => `
                     __     _
   ____  __  _______/ /__  (_)
  / __ \\/ / / / ___/ / _ \\/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\\__,_/\\___/_/\\___/_/   v3.1.0

      projectdiscovery.io

[INF] Running nuclei with 7842 templates
[INF] Targets loaded for scan: 1
[INF] Templates loaded for scan: 7842
[INF] Using 25 rules (3 templates, 22 matchers)

[tech-detect] [http] [info] ${target} [nginx]
[tech-detect] [http] [info] ${target} [php:8.1.12]
[waf-detect:cloudflare] [http] [info] ${target}
[ssl-issuer] [ssl] [info] ${target} [Let's Encrypt]
[ssl-dns-names] [ssl] [info] ${target} [${domain},www.${domain}]

[CVE-2023-25690:apache-http-request-smuggling] [http] [critical] ${target}
[CVE-2022-41040:microsoft-exchange-ssrf] [http] [critical] ${target}/owa/
[exposed-panels:jenkins-login] [http] [medium] ${target}:8080
[git-config:exposed] [http] [medium] ${target}/.git/config
[directory-listing] [http] [low] ${target}/backup/
[missing-x-frame-options] [http] [info] ${target}
[missing-csp] [http] [info] ${target}
[missing-hsts] [http] [info] ${target}
[http-missing-security-headers:x-content-type-options] [http] [info] ${target}
[http-missing-security-headers:x-xss-protection] [http] [info] ${target}
[robots-txt-endpoint] [http] [info] ${target}/robots.txt
[sitemap-xml-endpoint] [http] [info] ${target}/sitemap.xml
[wordpress-detect:5.9.3] [http] [info] ${target}
[wordpress-xmlrpc-listmethods] [http] [info] ${target}/xmlrpc.php

[INF] Found 18 results in 24.6s
`.trim(),

    gobuster: () => `
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     ${target}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htaccess            (Status: 403) [Size: 278]
/.htpasswd            (Status: 403) [Size: 278]
/.hta                 (Status: 403) [Size: 278]
/admin                (Status: 301) [Size: 317] [--> ${target}/admin/]
/api                  (Status: 301) [Size: 315] [--> ${target}/api/]
/assets               (Status: 301) [Size: 318] [--> ${target}/assets/]
/backup               (Status: 403) [Size: 278]
/cgi-bin              (Status: 403) [Size: 278]
/config               (Status: 403) [Size: 278]
/css                  (Status: 301) [Size: 315] [--> ${target}/css/]
/data                 (Status: 403) [Size: 278]
/database             (Status: 403) [Size: 278]
/docs                 (Status: 301) [Size: 316] [--> ${target}/docs/]
/images               (Status: 301) [Size: 318] [--> ${target}/images/]
/img                  (Status: 301) [Size: 315] [--> ${target}/img/]
/includes             (Status: 403) [Size: 278]
/index.html           (Status: 200) [Size: 15234]
/js                   (Status: 301) [Size: 314] [--> ${target}/js/]
/lib                  (Status: 301) [Size: 315] [--> ${target}/lib/]
/login                (Status: 200) [Size: 3421]
/logs                 (Status: 403) [Size: 278]
/plugins              (Status: 301) [Size: 319] [--> ${target}/plugins/]
/robots.txt           (Status: 200) [Size: 52]
/server-status        (Status: 403) [Size: 278]
/static               (Status: 301) [Size: 318] [--> ${target}/static/]
/temp                 (Status: 403) [Size: 278]
/test                 (Status: 301) [Size: 316] [--> ${target}/test/]
/tmp                  (Status: 403) [Size: 278]
/uploads              (Status: 301) [Size: 319] [--> ${target}/uploads/]
/vendor               (Status: 301) [Size: 318] [--> ${target}/vendor/]
/wp-admin             (Status: 301) [Size: 320] [--> ${target}/wp-admin/]
/wp-content           (Status: 301) [Size: 322] [--> ${target}/wp-content/]
/wp-includes          (Status: 301) [Size: 323] [--> ${target}/wp-includes/]

===============================================================
Finished
===============================================================
`.trim(),

    ffuf: () => `
        /'___\\  /'___\\           /'___\\       
       /\\ \\__/ /\\ \\__/  __  __  /\\ \\__/       
       \\ \\ ,__\\\\ \\ ,__\\/\\ \\/\\ \\ \\ \\ ,__\\      
        \\ \\ \\_/ \\ \\ \\_/\\ \\ \\_\\ \\ \\ \\ \\_/      
         \\ \\_\\   \\ \\_\\  \\ \\____/  \\ \\_\\       
          \\/_/    \\/_/   \\/___/    \\/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : ${target}/FUZZ
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/common.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
________________________________________________

.git/HEAD               [Status: 200, Size: 23, Words: 2, Lines: 2]
.gitignore              [Status: 200, Size: 145, Words: 12, Lines: 15]
admin                   [Status: 301, Size: 317, Words: 20, Lines: 10]
api                     [Status: 200, Size: 43, Words: 1, Lines: 1]
assets                  [Status: 301, Size: 319, Words: 20, Lines: 10]
backup                  [Status: 403, Size: 278, Words: 20, Lines: 10]
config.php.bak          [Status: 200, Size: 1532, Words: 34, Lines: 45]
dashboard               [Status: 302, Size: 0, Words: 1, Lines: 1]
db                      [Status: 403, Size: 278, Words: 20, Lines: 10]
debug                   [Status: 200, Size: 8923, Words: 234, Lines: 156]
env                     [Status: 200, Size: 234, Words: 8, Lines: 12]
login                   [Status: 200, Size: 4521, Words: 123, Lines: 89]
phpinfo.php             [Status: 200, Size: 89234, Words: 4521, Lines: 1234]
server-status           [Status: 403, Size: 278, Words: 20, Lines: 10]
test                    [Status: 200, Size: 1234, Words: 45, Lines: 23]
uploads                 [Status: 301, Size: 320, Words: 20, Lines: 10]

:: Progress: [4713/4713] :: Job [1/1] :: 892 req/sec :: Duration: [0:00:05] :: Errors: 0 ::
`.trim(),

    httpprobe: () => `
[httprobe] Probing ${domain}...

https://www.${domain} [200]
https://api.${domain} [200]
https://admin.${domain} [403]
https://mail.${domain} [200]
https://blog.${domain} [200]
https://dev.${domain} [401]
https://staging.${domain} [200]
https://portal.${domain} [302] -> https://login.${domain}
https://dashboard.${domain} [200]
https://cdn.${domain} [200]
http://test.${domain} [200]
http://legacy.${domain} [200]

Alive: 12/15 probed
`.trim(),

    masscan: () => {
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0/24`;
      return `
Starting masscan 1.3.2 (http://bit.ly/14GZzcT)
Initiating SYN Stealth Scan
Scanning ${ip} [65535 ports]
Rate: 10000.00 kpps

Discovered open port 22/tcp on ${ip.replace('/24', '.45')}
Discovered open port 80/tcp on ${ip.replace('/24', '.45')}
Discovered open port 443/tcp on ${ip.replace('/24', '.45')}
Discovered open port 3306/tcp on ${ip.replace('/24', '.45')}
Discovered open port 22/tcp on ${ip.replace('/24', '.67')}
Discovered open port 80/tcp on ${ip.replace('/24', '.67')}
Discovered open port 8080/tcp on ${ip.replace('/24', '.67')}
Discovered open port 22/tcp on ${ip.replace('/24', '.102')}
Discovered open port 21/tcp on ${ip.replace('/24', '.102')}
Discovered open port 80/tcp on ${ip.replace('/24', '.102')}
Discovered open port 443/tcp on ${ip.replace('/24', '.102')}
Discovered open port 3389/tcp on ${ip.replace('/24', '.102')}
Discovered open port 22/tcp on ${ip.replace('/24', '.201')}
Discovered open port 25/tcp on ${ip.replace('/24', '.201')}
Discovered open port 587/tcp on ${ip.replace('/24', '.201')}
Discovered open port 993/tcp on ${ip.replace('/24', '.201')}

Scan completed: 256 IPs scanned, 16 open ports found
`.trim();
    },

    rustscan: () => `
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \\ |  \`| |
| .-. \\| {_} |.-._} } | |  .-._} }\\     }/  /\\  \\| |\\  |
\`-' \`-'\`-----'\`----'  \`-'  \`----'  \`---' \`-'  \`-'\`-' \`-'
The Modern Day Port Scanner.

[~] Scanning ${target}
[~] Running script scanning...

Open ${target}:22
Open ${target}:80
Open ${target}:443
Open ${target}:3306
Open ${target}:8080
Open ${target}:8443

[~] Finished scanning in 0.84s

PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-proxy
8443/tcp open  https-alt

[~] Found 6 open ports on ${target}
`.trim(),

    nikto: () => `
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}
+ Target Hostname:    ${domain}
+ Target Port:        443
+ Start Time:         ${new Date().toLocaleString()}
---------------------------------------------------------------------------
+ SSL Info:        Subject:  /CN=${domain}
                   Ciphers:  TLS_AES_256_GCM_SHA384
                   Issuer:   /C=US/O=Let's Encrypt/CN=R3
+ Server: nginx/1.22.1
+ /: The X-Content-Type-Options header is not set.
+ /: The X-Frame-Options header is not set.
+ /robots.txt: contains 5 entries which should be manually viewed.
+ /admin/: Directory indexing found.
+ /admin/: Admin login page/section found.
+ /backup/: Backup files found.
+ /config.php.bak: Config backup found, may contain credentials.
+ /phpinfo.php: PHP info file found.
+ /.git/: Git repository found.
+ /server-status: Apache server-status page found (protected).
+ /wp-login.php: WordPress login found.
+ /xmlrpc.php: WordPress XML-RPC interface found.
+ /wp-content/debug.log: WordPress debug log found.
+ /readme.html: WordPress readme found.
+ 7535 requests: 0 error(s) and 14 item(s) reported on remote host
+ End Time:           ${new Date().toLocaleString()} (32 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
`.trim(),

    whatweb: () => `
WhatWeb report for ${target}
Status    : 200 OK
Title     : ${domain} - Welcome

Summary   : Cookies[PHPSESSID,__cf_bm], HTML5, HTTPServer[nginx/1.22.1], 
            IP[${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}], 
            JQuery[3.6.0], Modernizr[2.8.3], nginx[1.22.1], 
            Open-Graph-Protocol, PHP[8.1.12], PasswordField[password], 
            Script[text/javascript], UncommonHeaders[x-powered-by,cf-cache-status,cf-ray], 
            WordPress[6.4.2], X-Powered-By[PHP/8.1.12]

Detected Plugins:
[ Cloudflare ]
        CDN and DDoS mitigation
        Website: https://www.cloudflare.com

[ jQuery ]
        JavaScript framework
        Version: 3.6.0
        Website: https://jquery.com

[ nginx ]
        Web server
        Version: 1.22.1
        Website: https://nginx.org

[ PHP ]
        Server-side scripting language
        Version: 8.1.12
        Website: https://www.php.net

[ WordPress ]
        Blog/CMS
        Version: 6.4.2
        Website: https://wordpress.org
`.trim(),

    xsstrike: () => `
 __   _____ ___ _        _ _       
 \\ \\ / / __/ __| |_ _ __(_) |_____ 
  > V <\\__ \\__ \\  _| '_| | / / -_)
 /_\\_\\|___/___/\\__|_| |_|_\\_\\___|
                              v3.1.5

[~] Checking for DOM vulnerabilities 
[+] WAF detected: Cloudflare
[~] Testing parameter: q
[~] Crawling the target for potential injection points

[+] Vulnerable parameter found!
    URL: ${target}?q=test
    Parameter: q
    Payload: <img src=x onerror=alert(1)>
    Context: HTML body

[+] Reflected XSS found!
    URL: ${target}/search?q=test
    Parameter: q  
    Payload: "><script>alert('XSS')</script>
    
[+] DOM-based XSS found!
    URL: ${target}#<img/src=x onerror=alert(1)>
    Sink: innerHTML
    Source: location.hash

[~] Scanning completed
[+] Found 3 potential XSS vulnerabilities
`.trim(),

    commix: () => `
                                        __
   ___    ___     ___ ___     ___ ___  |__|__  __
  /'___\\ / __\`\\ /' __\` __\`\\ /' __\` __\`\\|  |  \\/  |
 /\\ \\__//\\ \\_\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\|  |>    <
 \\ \\____\\ \\____/\\ \\_\\ \\_\\ \\_\\ \\_\\ \\_\\ \\_\\__/__/\\__\\
  \\/____/\\/___/  \\/_/\\/_/\\/_/\\/_/\\/_/\\/_/__/\\/_/\\/_/  v3.7

[*] Testing connection to target URL.
[*] Checking if target is protected by WAF/IPS.
[+] Heuristics detected WAF/IPS: Cloudflare

[*] Testing 'cmd' parameter for command injection.
[+] The parameter 'cmd' seems injectable!

[*] Testing payload: ;id
[+] Command injection confirmed!

---
Payload: ;id
Output: uid=33(www-data) gid=33(www-data) groups=33(www-data)
---

[*] Do you want to enumerate the current user? [Y/n]
[+] Current user: www-data

[*] Do you want to read /etc/passwd? [Y/n]
[+] File content:
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false

[+] Command injection point confirmed at ${target}
`.trim(),

    dirsearch: () => `
  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25
Wordlist size: 11460

Target: ${target}

[${new Date().toLocaleTimeString()}] Starting...

[${new Date().toLocaleTimeString()}] 200 -    4KB - /
[${new Date().toLocaleTimeString()}] 301 -  317B - /admin -> ${target}/admin/
[${new Date().toLocaleTimeString()}] 302 -    0B - /admin/ -> /login
[${new Date().toLocaleTimeString()}] 200 -    2KB - /api/
[${new Date().toLocaleTimeString()}] 200 -   43B - /api/v1/health
[${new Date().toLocaleTimeString()}] 403 -  278B - /backup/
[${new Date().toLocaleTimeString()}] 200 -   23B - /.git/HEAD
[${new Date().toLocaleTimeString()}] 200 -  145B - /.gitignore
[${new Date().toLocaleTimeString()}] 200 -  1KB - /config.php.bak
[${new Date().toLocaleTimeString()}] 200 -   15KB - /index.html
[${new Date().toLocaleTimeString()}] 200 -    3KB - /login
[${new Date().toLocaleTimeString()}] 200 -   52B - /robots.txt
[${new Date().toLocaleTimeString()}] 200 -    1KB - /sitemap.xml
[${new Date().toLocaleTimeString()}] 301 -  320B - /uploads -> ${target}/uploads/
[${new Date().toLocaleTimeString()}] 403 -  278B - /uploads/

Task Completed
`.trim(),

    wfuzz: () => `
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: ${target}/FUZZ
Total requests: 4614

=====================================================================
ID           Response   Lines    Word       Chars       Payload
=====================================================================

000000001:   200        125 L    512 W      15234 Ch    "index"
000000002:   301        7 L      12 W       317 Ch      "admin"
000000003:   200        45 L     123 W      4521 Ch     "login"
000000004:   301        7 L      12 W       315 Ch      "api"
000000005:   200        3 L      8 W        43 Ch       "api/health"
000000006:   403        9 L      28 W       278 Ch      "backup"
000000007:   403        9 L      28 W       278 Ch      "config"
000000008:   301        7 L      12 W       315 Ch      "css"
000000009:   301        7 L      12 W       315 Ch      "js"
000000010:   301        7 L      12 W       318 Ch      "images"
000000011:   200        1 L      5 W        52 Ch       "robots.txt"
000000012:   200        23 L     45 W       1234 Ch     "sitemap.xml"
000000013:   301        7 L      12 W       320 Ch      "uploads"
000000014:   200        1 L      2 W        23 Ch       ".git/HEAD"
000000015:   200        15 L     34 W       1532 Ch     "config.php.bak"

Total time: 8.234567
Processed Requests: 4614
Filtered Requests: 4599
Requests/sec.: 560.4312
`.trim(),

    arjun: () => `
    _
   / \\   _ __  (_)_   _ _ __
  / _ \\ | '__| | | | | | '_ \\
 / ___ \\| |    | | |_| | | | |
/_/   \\_\\_|   _/ |\\__,_|_| |_|
             |__/              v2.2.1

[*] Probing ${target} for parameters

[*] Wordlist size: 25890
[*] Threads: 5
[*] Stability check: OK

[*] Testing parameters...

[+] Valid parameter found: id
[+] Valid parameter found: page
[+] Valid parameter found: search
[+] Valid parameter found: q
[+] Valid parameter found: query
[+] Valid parameter found: user
[+] Valid parameter found: username
[+] Valid parameter found: email
[+] Valid parameter found: password
[+] Valid parameter found: token
[+] Valid parameter found: action
[+] Valid parameter found: type
[+] Valid parameter found: category
[+] Valid parameter found: sort
[+] Valid parameter found: order
[+] Valid parameter found: limit
[+] Valid parameter found: offset
[+] Valid parameter found: callback
[+] Valid parameter found: redirect
[+] Valid parameter found: url

[*] Found 20 parameters on ${target}
[*] Saved to arjun_output.json
`.trim(),

    waybackurls: () => `
[waybackurls] Fetching URLs from Wayback Machine for ${domain}

https://${domain}/
https://${domain}/login
https://${domain}/admin
https://${domain}/api/v1/users
https://${domain}/api/v1/products
https://${domain}/search?q=test
https://${domain}/user/profile?id=1
https://${domain}/download?file=report.pdf
https://${domain}/redirect?url=https://example.com
https://${domain}/backup/db_backup.sql
https://${domain}/config.php.bak
https://${domain}/.git/config
https://${domain}/.env
https://${domain}/phpinfo.php
https://${domain}/debug/vars
https://${domain}/admin/config.json
https://${domain}/api/swagger.json
https://${domain}/graphql
https://${domain}/wp-admin/
https://${domain}/wp-content/uploads/
https://${domain}/.htaccess.bak
https://${domain}/server-status
https://${domain}/elmah.axd
https://${domain}/trace.axd

[+] Found 24 URLs from Wayback Machine
`.trim(),

    gau: () => `
[gau] GetAllUrls - Fetching URLs for ${domain}
[+] Sources: wayback, commoncrawl, otx, urlscan

https://${domain}/
https://${domain}/about
https://${domain}/contact
https://${domain}/login
https://${domain}/register
https://${domain}/forgot-password
https://${domain}/api/
https://${domain}/api/v1/
https://${domain}/api/v2/
https://${domain}/users/
https://${domain}/admin/
https://${domain}/dashboard/
https://${domain}/settings/
https://${domain}/profile/
https://${domain}/search?q=
https://${domain}/product?id=
https://${domain}/category?cat=
https://${domain}/page?p=
https://${domain}/download?file=
https://${domain}/redirect?url=
https://${domain}/callback?token=
https://${domain}/webhook/
https://${domain}/sitemap.xml
https://${domain}/robots.txt
https://${domain}/favicon.ico
https://${domain}/static/
https://${domain}/assets/
https://${domain}/uploads/
https://${domain}/images/
https://${domain}/css/
https://${domain}/js/

[+] Retrieved 31 unique URLs
`.trim(),

    sublist3r: () => `
                 ____        _     _ _     _   _____
                / ___| _   _| |__ | (_)___| |_|___ / _ __
                \\___ \\| | | | '_ \\| | / __| __| |_ \\| '__|
                 ___) | |_| | |_) | | \\__ \\ |_ ___) | |
                |____/ \\__,_|_.__/|_|_|___/\\__|____/|_|

                # Coded By Ahmed Aboul-Ela - @ababorels

[-] Enumerating subdomains now for ${domain}
[-] Searching Google...
[-] Searching Yahoo...
[-] Searching Bing...
[-] Searching Baidu...
[-] Searching DNSdumpster...
[-] Searching VirusTotal...
[-] Searching ThreatCrowd...
[-] Searching SSL Certificates...
[-] Searching PassiveDNS...

[+] Total Unique Subdomains Found: 18

www.${domain}
mail.${domain}
ftp.${domain}
localhost.${domain}
webmail.${domain}
smtp.${domain}
pop.${domain}
ns1.${domain}
webdisk.${domain}
ns2.${domain}
cpanel.${domain}
whm.${domain}
autodiscover.${domain}
autoconfig.${domain}
m.${domain}
imap.${domain}
test.${domain}
ns.${domain}
`.trim(),

    paramspider: () => `
 ____                            ____        _     _
|  _ \\ __ _ _ __ __ _ _ __ ___  / ___| _ __ (_) __| | ___ _ __
| |_) / _\` | '__/ _\` | '_ \` _ \\ \\___ \\| '_ \\| |/ _\` |/ _ \\ '__|
|  __/ (_| | | | (_| | | | | | | ___) | |_) | | (_| |  __/ |
|_|   \\__,_|_|  \\__,_|_| |_| |_||____/| .__/|_|\\__,_|\\___|_|
                                       |_|            v1.0

[+] Target: ${domain}
[+] Fetching URLs from archive sources...

${target}?id=FUZZ
${target}?page=FUZZ
${target}?search=FUZZ
${target}?q=FUZZ
${target}?url=FUZZ
${target}?redirect=FUZZ
${target}?file=FUZZ
${target}?path=FUZZ
${target}?download=FUZZ
${target}?cat=FUZZ
${target}?action=FUZZ
${target}?type=FUZZ
${target}?user=FUZZ
${target}?name=FUZZ
${target}?email=FUZZ
${target}?callback=FUZZ
${target}?next=FUZZ
${target}?dest=FUZZ
${target}?window=FUZZ
${target}?data=FUZZ

[+] Found 20 unique parameters
[+] Output saved to ${domain}_params.txt
`.trim(),
  };

  const outputFn = outputs[toolId];
  if (outputFn) {
    return outputFn();
  }

  return `[*] Executing ${toolId} against ${target}
[*] Scanning in progress...
[+] Scan completed successfully
[*] Results saved to output.txt`;
}