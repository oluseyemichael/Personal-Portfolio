// All portfolio content in one place.
// Updated with Michael Oluseye's CV & real-world project credentials.

export const content = {
  name: 'Michael Oluseye',
  shortName: 'Michael',
  title: 'Product & Operations Analyst | IT Business Analyst',
  tagline: 'Bridging engineering, business strategy, and user experience at every layer.',
  location: 'Rivers, Nigeria',

  bio: {
    headline: 'From server racks to product strategy.',
    body: 'Product-minded IT Business Analyst and Infrastructure Engineer bridging technical architecture, business strategy, and end-user needs. Currently leading product strategy, monetisation logic, and operational execution for workbrook (an AI hiring marketplace), while having engineered production systems ranging from 2,000 concurrent user CBT platforms to full-stack clinic management systems.',
    short: 'Product & Operations Analyst and IT Business Analyst. Track record includes cutting support resolution times by 75%, 95% UAT pre-launch issue resolution, 99.5% infrastructure uptime, and Vice Chancellor’s Award for Best Innovation of the Year.',
  },

  story: [
    {
      id: 'roots',
      title: 'Arrupe Jesuit University',
      text: 'BSc (Hons) ICT (CGPA: 3.63/4.0). Awarded the Vice Chancellor’s Award for Best Innovation of the Year. Built IoT support workflows and legal AI APIs.',
    },
    {
      id: 'support-manager',
      title: 'GABE Remote Asset Management',
      text: 'Technical Support Manager scaling enterprise clients by 40%. Reduced mean time to resolution from 24 hours to 6 hours (75% improvement) across 300+ accounts.',
    },
    {
      id: 'infrastructure',
      title: 'Jesuit Memorial College',
      text: 'IT Infrastructure Engineer maintaining 99.5% uptime for 1,000+ users and 2,000+ devices. Built and deployed SchoolClinic (Next.js 14/Prisma) and 2,000-user CBT system.',
    },
    {
      id: 'product',
      title: 'workbrook (Texas, USA)',
      text: 'Leading product and operations for an AI-powered hiring marketplace. Architected tiered monetisation, wallet & multi-currency payment logic, n8n automations, and global multi-country expansion.',
    },
  ],

  projects: [
    {
      id: 'workbrook',
      title: 'workbrook',
      subtitle: 'AI-Powered Hiring Marketplace (Texas, USA)',
      description: 'Lead product strategy, requirement engineering, and operational execution for a multi-tier AI hiring platform. Architected the core tiered monetisation model, structured multi-currency wallet payment flows, built n8n workflow automations for live job distribution, and drove AI matching feature rollouts for global expansion.',
      role: 'Product & Operations Analyst',
      tech: ['Product Strategy', 'Monetisation Design', 'n8n Automation', 'Payment Infrastructure', 'AI Features', 'Growth Mechanics'],
      highlight: 'Core revenue engine design + multi-country global expansion',
      layer: 'product',
      liveUrl: 'https://workbrook.com',
    },
    {
      id: 'schoolclinic',
      title: 'SchoolClinic',
      subtitle: 'Full-Stack Clinic Management System',
      description: 'Owned end-to-end design, build, and on-premise deployment of a full-stack clinic management platform. Features role-based workflow routing for doctors, nurses, pharmacists, and lab scientists. Replaced paper records and reduced monthly billing reconciliation from hours to a single export.',
      role: 'Lead Architect & Solo Developer',
      tech: ['Next.js 14', 'TypeScript', 'Prisma ORM', 'PostgreSQL 16', 'Role Routing', 'On-Premise Server'],
      highlight: 'Cut billing reconciliation from hours to a single report export',
      layer: 'application',
      images: ['/clinic-billing.png', '/clinic-pharmacy.png'],
    },
    {
      id: 'cbt',
      title: 'Offline CBT Platform',
      subtitle: '2,000 Concurrent Users, Zero Latency',
      description: 'Architected and deployed an offline Computer-Based Testing platform supporting 2,000 concurrent student users during peak examination periods. Delivered database schema, network topology, Linux server kernel tuning, and application layer end to end with 99.5% uptime.',
      role: 'Infrastructure & Software Architect',
      tech: ['Linux Server Tuning', 'Database Schemas', 'Network Topology', 'High-Load Concurrency', 'Uptime Engineering'],
      highlight: 'Zero latency under full 2,000 concurrent user load',
      layer: 'server',
    },
    {
      id: 'legal-ai',
      title: 'Legal Research AI APIs',
      subtitle: 'Top 5 Innovative Startup in Zimbabwe',
      description: 'Gathered requirements and designed RESTful APIs for an AI legal research assistant serving 10,000+ daily queries at 99.2% uptime. Reduced API response times by 60% via Redis caching and query optimisation.',
      role: 'Backend Developer (Procode Platforms)',
      tech: ['REST APIs', 'Python', 'Redis Caching', 'Query Optimisation', 'API Security'],
      highlight: '60% faster response times at 10,000+ daily queries',
      layer: 'application',
    },
    {
      id: 'gabe-iot',
      title: 'GABE Remote Asset Management',
      subtitle: '300+ Enterprise Clients & 98% SLA Compliance',
      description: 'Streamlined technical support operations across an 8-person team. Reduced mean time to resolution from 24h to 6h (75% improvement), achieved 98% SLA compliance, and scaled the enterprise client portfolio by 40%.',
      role: 'Technical Support Manager',
      tech: ['IoT Configuration', 'BPM', 'SLA Management', 'Enterprise Relations', 'SOP Documentation'],
      highlight: '75% reduction in resolution time (24h to 6h)',
      layer: 'network',
    },
  ],

  skills: [
    {
      group: 'Product & Business Analysis',
      items: [
        'Requirements Engineering',
        'Product Strategy',
        'Monetisation Design',
        'UAT Clearance',
        'Process Mapping',
        'Gap Analysis',
        'Stakeholder Management',
        'User Analytics',
      ],
    },
    {
      group: 'Engineering & Data',
      items: [
        'Python',
        'TypeScript',
        'Next.js 14',
        'SQL',
        'Prisma ORM',
        'Django',
        'Node.js',
        'Java',
        'REST APIs',
        'Power BI',
      ],
    },
    {
      group: 'Infrastructure & Systems',
      items: [
        'Linux Server',
        'Windows Server',
        'Active Directory',
        'LAN/WAN Topology',
        'AWS Cloud',
        'Azure',
        'Nginx Web Server',
        'CCTV / Biometrics / RFID',
      ],
    },
    {
      group: 'Security & Governance',
      items: [
        'CompTIA Security+',
        'ISC2 Certified in Cybersecurity (CC)',
        'Threat & Vulnerability Mgmt',
        'Access Control',
        'Disaster Recovery',
        'Network Security',
        'Firewalls',
        'ITIL Framework',
      ],
    },
    {
      group: 'Automation & DevOps',
      items: [
        'n8n Automation',
        'GitHub Actions',
        'CI/CD Pipelines',
        'Docker Containers',
        'Postman API Testing',
        'JIRA / Confluence',
        'Figma Wireframing',
        'Stanford Code in Place',
      ],
    },
  ],

  credentials: [
    'Vice Chancellor’s Award for Best Innovation of the Year — Arrupe Jesuit University (BSc ICT, CGPA: 3.63/4.0)',
    'CompTIA Security+ Certification (2026)',
    'ISC2 Certified in Cybersecurity (CC) (2026)',
    'Stanford Code in Place (Stanford University, 2025)',
    'Huawei Seeds for the Future (Huawei, 2023)',
    'Front-End Development (Selfless Hearts Foundation, 2024)',
  ],

  contact: {
    email: 'oluseyemichael11@gmail.com',
    phone: '+234 703 723 4416',
    github: 'https://github.com/oluseyemichael',
    linkedin: 'https://www.linkedin.com/in/michael-oluseye-406558216/',
    cta: "Let's build something that holds up in production.",
  },
};
