import { useEffect } from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DocumentationPage() {
  useEffect(() => {
    document.title = 'Pocket Linux (Cyber Guardian 360) - Project Documentation';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Navigation - Hidden in print */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back to Dashboard</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span className="font-mono text-sm">Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="documentation-content bg-white text-black min-h-screen print:bg-white">
        <div className="container mx-auto px-8 py-8 print:px-0 print:py-0 pt-24 print:pt-8">
          
          {/* Cover Page */}
          <section className="page-break-after min-h-[90vh] print:min-h-screen flex flex-col justify-center items-center text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🛡️</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">POCKET LINUX</h1>
              <h2 className="text-2xl font-semibold text-emerald-600 mb-6">(Cyber Guardian 360)</h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                A Web-Based Cybersecurity Toolkit for Bug Bounty Hunting and Penetration Testing
              </p>
            </div>
            
            <div className="mt-12 text-gray-500">
              <p className="text-sm">Project Documentation</p>
              <p className="text-sm mt-2">Version 1.0</p>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 w-64">
              <p className="text-sm text-gray-500">Submitted by</p>
              <p className="text-lg font-semibold text-gray-700 mt-1">Jaswanth</p>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              Table of Contents
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>1. Abstract</span>
                <span className="text-gray-500">3</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>2. Existing Systems</span>
                <span className="text-gray-500">4</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>3. Proposed System</span>
                <span className="text-gray-500">5</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>4. System Architecture</span>
                <span className="text-gray-500">6</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>5. Modules Description</span>
                <span className="text-gray-500">7</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                <span>6. Technologies Used</span>
                <span className="text-gray-500">8</span>
              </div>
            </div>
          </section>

          {/* Abstract */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              1. Abstract
            </h2>
            
            <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
              <p>
                <strong>Pocket Linux (Cyber Guardian 360)</strong> is a web-based cybersecurity toolkit designed to 
                democratize penetration testing and bug bounty hunting by providing browser-accessible security tools. 
                Traditional security testing requires complex local installations of Kali Linux and command-line expertise, 
                creating barriers for security researchers and ethical hackers. This project eliminates these obstacles 
                by offering a mobile-responsive web interface that simulates 20+ industry-standard security tools.
              </p>
              
              <p>
                The application leverages modern web technologies including React, TypeScript, and Tailwind CSS for 
                the frontend, with PostgreSQL database providing backend data persistence. Users can execute reconnaissance 
                tools (Subfinder, Amass, Nmap), vulnerability scanners (Nuclei, Nikto), exploitation tools (SQLMap, XSStrike), 
                and fuzzing utilities (Gobuster, FFUF) through an intuitive graphical interface or terminal emulator. 
                All execution outputs are stored persistently and can be accessed, searched, and downloaded from a 
                dedicated file management page.
              </p>
              
              <p>
                This solution addresses the growing demand for accessible cybersecurity tools in an era of increasing 
                digital threats. By providing realistic tool outputs and professional-grade interfaces, Pocket Linux 
                serves as both a practical utility for security professionals and an educational platform for aspiring 
                penetration testers, enabling security testing from any device without requiring specialized hardware 
                or software installations.
              </p>
            </div>
          </section>

          {/* Existing Systems */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              2. Existing Systems
            </h2>
            
            <div className="space-y-6 text-gray-700">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Kali Linux</h3>
                <p className="text-justify leading-relaxed">
                  Kali Linux is a Debian-based Linux distribution containing 600+ pre-installed penetration testing tools. 
                  It is the industry standard for security professionals and ethical hackers. The distribution requires 
                  installation on dedicated hardware or virtual machine, extensive command-line knowledge, and significant 
                  system resources including minimum 2GB RAM and 20GB storage. Major limitations include requiring local 
                  installation, lack of portability, steep learning curve, being resource-intensive, and inability to 
                  run on mobile devices.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Parrot Security OS</h3>
                <p className="text-justify leading-relaxed">
                  Parrot Security OS is another Linux distribution focused on security testing, forensics, and privacy. 
                  It offers similar tools to Kali with additional anonymity features. The system requires dedicated 
                  hardware or VM setup with technical expertise for configuration. It shares the same portability issues 
                  as Kali, requires dedicated hardware, has no web-based access, and involves a complex setup process.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Pentest-Tools.com</h3>
                <p className="text-justify leading-relaxed">
                  Pentest-Tools.com is a commercial web-based platform offering limited security scanning tools. 
                  It provides basic reconnaissance and vulnerability scanning through a browser interface. However, 
                  most advanced features require expensive subscription plans. Key limitations include a limited 
                  free tier, expensive premium plans, restricted tool selection, no terminal interface, and no 
                  offline capability.
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Common Limitations of Existing Systems:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Require specialized hardware or expensive subscriptions</li>
                  <li>No mobile-responsive interfaces for on-the-go testing</li>
                  <li>Complex installation and configuration processes</li>
                  <li>Limited accessibility for beginners and students</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Proposed System */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              3. Proposed System
            </h2>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-justify leading-relaxed">
                <strong>Pocket Linux (Cyber Guardian 360)</strong> addresses all limitations of existing systems by 
                providing a fully web-based, mobile-responsive cybersecurity toolkit accessible from any modern browser.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Zero Installation Required:</strong> Access 20+ security tools directly through web browser without downloading or configuring software</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Mobile-First Design:</strong> Fully responsive interface optimized for smartphones, tablets, and desktops enabling security testing from anywhere</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Three Execution Modes:</strong> Categorized tool cards for beginners, terminal emulator for advanced users, and file viewer for output management</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Persistent Storage:</strong> All tool outputs saved to cloud database with search, filter, and download capabilities</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Realistic Outputs:</strong> Professional-grade simulated outputs matching actual tool behavior for educational purposes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Stack:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">Frontend</p>
                    <p className="text-sm text-gray-600">React 18, TypeScript, Tailwind CSS, shadcn/ui</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">Backend</p>
                    <p className="text-sm text-gray-600">PostgreSQL Database with Row-Level Security</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">Build Tool</p>
                    <p className="text-sm text-gray-600">Vite for fast development</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">Deployment</p>
                    <p className="text-sm text-gray-600">Cloud-hosted with global CDN</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Advantages Over Existing Systems:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Accessible from any device with internet connection</li>
                  <li>No technical setup or system requirements</li>
                  <li>Free to use with no subscription barriers</li>
                  <li>Educational tool for learning security concepts</li>
                  <li>Professional interface suitable for demonstrations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* System Architecture */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              4. System Architecture
            </h2>
            
            <div className="space-y-6 text-gray-700">
              {/* ASCII Architecture Diagram */}
              <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="text-gray-800">{`
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Desktop       │  │    Tablet       │  │    Mobile       │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           └────────────────────┼────────────────────┘           │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         React Frontend (TypeScript + Tailwind CSS)       │    │
│  │                     + shadcn/ui Components               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐    │
│  │  Tool Cards   │  │   Terminal    │  │   File Viewer     │    │
│  │   Interface   │  │   Emulator    │  │      Page         │    │
│  └───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘    │
│          └──────────────────┼────────────────────┘              │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Category Filter System                      │    │
│  │    (Recon | Scanning | Exploitation | Fuzzing | OSINT)   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Tool Execution Engine                       │    │
│  │              (realistic-outputs.ts)                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌───────────────────────┐  ┌───────────────────────────┐       │
│  │    Command Parser     │  │    Output Generator       │       │
│  │    (Terminal.tsx)     │  │                           │       │
│  └───────────────────────┘  └───────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Cloud Database)                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  PostgreSQL Database                     │    │
│  │  ┌─────────────────────┐  ┌─────────────────────────┐   │    │
│  │  │  tool_executions    │  │   terminal_sessions     │   │    │
│  │  │  - id               │  │   - id                  │   │    │
│  │  │  - tool_name        │  │   - command             │   │    │
│  │  │  - target           │  │   - output              │   │    │
│  │  │  - command          │  │   - created_at          │   │    │
│  │  │  - output           │  │                         │   │    │
│  │  │  - status           │  │                         │   │    │
│  │  └─────────────────────┘  └─────────────────────────┘   │    │
│  │              Row-Level Security Policies                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                `}</pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Architecture Description:</h3>
                <p className="text-justify leading-relaxed">
                  The application follows a <strong>three-tier architecture</strong> pattern. The <strong>Client Layer</strong> handles 
                  user interface rendering using React components styled with Tailwind CSS, supporting all device types including 
                  desktop, tablet, and mobile. The <strong>Application Layer</strong> manages user interactions across three distinct 
                  interfaces: Tool Cards for visual execution, Terminal for command-line access, and File Viewer for output management. 
                  The <strong>Business Logic Layer</strong> processes tool executions through the command parser and generates realistic 
                  outputs. The <strong>Data Layer</strong> utilizes PostgreSQL for persistent storage with security policies protecting 
                  data integrity and user isolation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Flow:</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>User enters target domain/IP in Tool Card or Terminal</li>
                  <li>Request processed by Application Layer components</li>
                  <li>Business Logic Layer generates realistic tool output</li>
                  <li>Execution record saved to PostgreSQL database</li>
                  <li>Output displayed to user and available in File Viewer</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Modules Description */}
          <section className="page-break-after py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              5. Modules Description
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Module</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">File Location</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Header Navigation</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">Header.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Responsive navigation bar with logo, menu links, and mobile hamburger menu</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">Tool Card System</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">ToolCard.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Interactive cards with tool info, target input, and execute button with loading states</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Category Filter</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">CategoryFilter.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Filter buttons for tool categories: Recon, Scanning, Exploitation, Fuzzing, OSINT</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">Terminal Emulator</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">Terminal.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Command-line interface with history navigation and built-in commands</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Output Panel</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">OutputPanel.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Slide-out panel displaying real-time execution results</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">File Viewer Page</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">FilesPage.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Dedicated page for viewing, searching, filtering, and downloading outputs</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Output Generator</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">realistic-outputs.ts</td>
                    <td className="border border-gray-300 px-3 py-2">Engine generating professional outputs matching actual security tools</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">Tools Database</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">tools.ts</td>
                    <td className="border border-gray-300 px-3 py-2">Configuration containing 20+ security tools with commands and categories</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Dashboard Page</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">Index.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Main landing page with hero section, statistics, and tool grid</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">Terminal Page</td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-xs">TerminalPage.tsx</td>
                    <td className="border border-gray-300 px-3 py-2">Full-screen terminal interface for advanced command-line usage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Technologies Used */}
          <section className="py-8 print:py-0">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-2 mb-6">
              6. Technologies Used
            </h2>
            
            <div className="space-y-6 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3">Frontend Technologies</h3>
                  <ul className="space-y-2">
                    <li><strong>React 18:</strong> Component-based UI library</li>
                    <li><strong>TypeScript:</strong> Type-safe JavaScript</li>
                    <li><strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                    <li><strong>shadcn/ui:</strong> Accessible component library</li>
                    <li><strong>Lucide React:</strong> Icon library</li>
                    <li><strong>React Router:</strong> Client-side routing</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3">Backend Technologies</h3>
                  <ul className="space-y-2">
                    <li><strong>PostgreSQL:</strong> Relational database</li>
                    <li><strong>Row-Level Security:</strong> Data protection policies</li>
                    <li><strong>Cloud Hosting:</strong> Scalable infrastructure</li>
                    <li><strong>REST API:</strong> Data communication</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3">Development Tools</h3>
                  <ul className="space-y-2">
                    <li><strong>Vite:</strong> Fast build tool and dev server</li>
                    <li><strong>ESLint:</strong> Code quality linting</li>
                    <li><strong>Git:</strong> Version control</li>
                    <li><strong>npm/bun:</strong> Package management</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3">Security Tools Simulated</h3>
                  <ul className="space-y-2">
                    <li><strong>Recon:</strong> Subfinder, Amass, GAU, Waybackurls</li>
                    <li><strong>Scanning:</strong> Nmap, Masscan, Nuclei, Nikto</li>
                    <li><strong>Exploitation:</strong> SQLMap, XSStrike, Commix</li>
                    <li><strong>Fuzzing:</strong> Gobuster, FFUF, Dirsearch</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Pocket Linux (Cyber Guardian 360) - Project Documentation</p>
            <p className="mt-1">© 2024 Jaswanth. All Rights Reserved.</p>
          </footer>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          .page-break-after {
            page-break-after: always;
          }
          
          .documentation-content {
            font-size: 11pt;
            line-height: 1.5;
          }
          
          h2 {
            font-size: 16pt;
          }
          
          h3 {
            font-size: 13pt;
          }
          
          table {
            font-size: 9pt;
          }
          
          pre {
            font-size: 7pt;
            white-space: pre-wrap;
          }
        }
      `}</style>
    </>
  );
}
