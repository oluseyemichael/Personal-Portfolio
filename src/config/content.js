// All portfolio content in one place.
// This file is direction-agnostic: whichever visual concept we ship,
// this data feeds it.

export const content = {
  name: 'Michael Oluseye',
  shortName: 'Michael',
  tagline: "I've worked at every layer.",
  location: 'Rivers, Nigeria',

  bio: {
    headline: 'From server racks to product strategy.',
    body: 'I build and run systems end to end. I started in cables, servers, and campus networks, moved up through backend engineering, and now lead product and operations for an AI-powered hiring marketplace. Infrastructure taught me how things break. Product taught me why they matter.',
    short: 'Product analyst and infrastructure engineer. I ship systems at every layer of the stack, from network topology to monetisation strategy.',
  },

  story: [
    {
      id: 'roots',
      title: 'Port Harcourt',
      text: 'Where it started. Curiosity about how systems fit together.',
    },
    {
      id: 'harare',
      title: 'Harare',
      text: 'BSc ICT at Arrupe Jesuit University. Vice Chancellor\u2019s Award for Best Innovation of the Year. Built IoT support operations at GABE and APIs for an award-winning legal AI startup.',
    },
    {
      id: 'infrastructure',
      title: 'The Infrastructure Years',
      text: '99.5% uptime for 1,000+ users across 2,000+ devices. Hardened servers, designed networks, shipped platforms that ran entire campuses.',
    },
    {
      id: 'product',
      title: 'Product',
      text: 'Now leading product and operations for workbrook, an AI-powered hiring marketplace. Monetisation design, payment infrastructure, AI feature rollout, multi-country expansion.',
    },
  ],

  projects: [
    {
      id: 'workbrook',
      title: 'workbrook',
      subtitle: 'AI-Powered Hiring Marketplace',
      description: 'Lead product and operational execution for a multi-tier hiring marketplace. Designed the tiered monetisation model, structured wallet and multi-currency payment logic, and drove rollout of AI hiring features (intelligent matching, resume analysis, talent discovery).',
      role: 'Product & Operations Analyst',
      tech: ['Product Strategy', 'Monetisation Design', 'n8n Automation', 'AI Features', 'Payment Infrastructure'],
      highlight: 'Core revenue engine design + multi-country expansion logic',
      layer: 'product',
    },
    {
      id: 'schoolclinic',
      title: 'SchoolClinic',
      subtitle: 'Full-Stack Clinic Management System',
      description: 'Owned end-to-end design, build, and deployment of a clinic management system with role-based workflow routing for nurses, doctors, lab scientists, and pharmacists. Replaced paper records; reduced monthly billing reconciliation from hours to a single report export.',
      role: 'Designer, Developer, Deployer (solo)',
      tech: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL 16', 'On-Premise Deployment'],
      highlight: 'Solo-built and deployed, in production use',
      layer: 'application',
    },
    {
      id: 'cbt',
      title: 'Offline CBT Platform',
      subtitle: '2,000 Concurrent Users, Zero Latency',
      description: 'Designed, built, and deployed an offline computer-based testing platform supporting 2,000 concurrent users. Delivered the database schema, network topology, Linux server configuration, and application layer end to end.',
      role: 'Architect & Engineer (end-to-end)',
      tech: ['Linux', 'Network Topology', 'Database Design', 'Load Handling'],
      highlight: 'Zero-latency performance at full load',
      layer: 'server',
    },
    {
      id: 'campus-network',
      title: 'Campus Network & Security',
      subtitle: '99.5% Uptime, 2,000+ Devices',
      description: 'Maintained 99.5% network uptime for 1,000+ users across 2,000+ managed devices through redundant design and proactive monitoring. Hardened Windows Server for 700+ accounts, cutting vulnerabilities by 85%. Managed CCTV, biometric attendance for 200+ staff, and RFID access control.',
      role: 'IT Infrastructure Engineer',
      tech: ['Windows Server', 'Active Directory', 'Ubiquiti UDM Pro', 'CCTV/Biometrics/RFID', 'DNS/DHCP'],
      highlight: '85% vulnerability reduction',
      layer: 'network',
    },
    {
      id: 'legal-ai',
      title: 'Legal Research AI APIs',
      subtitle: 'Top 5 Innovative Startup in Zimbabwe',
      description: 'Designed RESTful APIs for an AI-powered legal research tool serving 10,000+ daily requests at 99.2% uptime. Reduced API response times by 60% through caching and optimisation.',
      role: 'Backend Developer',
      tech: ['REST APIs', 'Caching', 'Python', 'Performance Optimisation'],
      highlight: '60% faster responses at 10k+ daily requests',
      layer: 'application',
    },
  ],

  skills: [
    {
      group: 'Product & Analysis',
      items: ['Requirements Engineering', 'Product Strategy', 'Monetisation Design', 'UAT', 'Process Mapping', 'Roadmap Planning', 'Stakeholder Management'],
    },
    {
      group: 'Engineering',
      items: ['Python', 'TypeScript', 'Next.js', 'SQL', 'Prisma', 'Django', 'Node.js', 'REST APIs', 'Power BI'],
    },
    {
      group: 'Infrastructure',
      items: ['Linux', 'Windows Server', 'Active Directory', 'LAN/WAN Design', 'AWS', 'Azure', 'Docker', 'Nginx'],
    },
    {
      group: 'Security',
      items: ['CompTIA Security+', 'ISC2 CC', 'Threat & Vulnerability Mgmt', 'Access Control', 'Disaster Recovery', 'Network Security'],
    },
    {
      group: 'Automation & Tools',
      items: ['n8n', 'Git/GitHub', 'JIRA', 'Figma', 'Postman', 'Notion'],
    },
  ],

  credentials: [
    'BSc (Hons) ICT, Arrupe Jesuit University \u2014 Vice Chancellor\u2019s Award for Best Innovation of the Year',
    'CompTIA Security+ (2026)',
    'ISC2 Certified in Cybersecurity (2026)',
    'Stanford Code in Place (2025)',
  ],

  contact: {
    email: 'oluseyemichael11@gmail.com',
    // TODO(Michael): replace with your real profile URLs
    github: 'https://github.com/YOUR_GITHUB_USERNAME',
    linkedin: 'https://linkedin.com/in/YOUR_LINKEDIN_HANDLE',
    cta: "Let's build something that holds up in production.",
  },
};
