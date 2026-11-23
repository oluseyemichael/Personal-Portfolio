// All portfolio content in one place. Facts come from the two CVs
// (Michael_Oluseye_ITAnalyst.pdf and Michael_Oluseye_ITEngineer.pdf).
// Employer names are deliberately NOT on the public site: roles are
// described by sector instead. The AI guide reads this whole object, so
// anything here ends up in its answers.
// Voice: first person, confident, a little playful, real numbers. No em dashes.

export const content = {
  name: 'Michael Oluseye',
  shortName: 'Michael',
  title: 'IT Business Analyst & Product Manager',
  tagline: 'I translate between the people who want it and the people who build it.',
  location: 'Rivers, Nigeria',

  // Short lines used by the interface (headings, hints, microcopy)
  copy: {
    hero: "Started in the server room. Now I lead product. I've worked every layer of the stack and I'm proud of it. Scroll to see how I got here.",
    workHeading: 'Built it. Shipped it.',
    skillsHeading: 'The stack. All of it.',
    contactHeading: "Let's build something that holds up.",
    contactNote: 'Based in Rivers, Nigeria. Working with teams anywhere. Email is the way in.',
    nowLabel: 'Right now',
    proof: 'CompTIA Security+  ·  ISC2 Certified in Cybersecurity  ·  Vice Chancellor’s Award for Best Innovation of the Year',
    built: 'This site runs on React, Three.js and Vercel, with a Claude-powered guide.',
  },

  // Current roles (both ongoing). Sector only, no employer names.
  now: [
    { org: 'AI crowdsourcing platform', role: 'Product & Operations Analyst', place: 'US-based, remote' },
    { org: 'Education sector', role: 'IT Infrastructure Engineer', place: 'Rivers, Nigeria' },
  ],

  // Numbers worth knowing, straight from the CVs
  stats: [
    { value: '2,000', label: 'concurrent users on the offline exam system' },
    { value: '99.5%', label: 'network uptime across 2,000+ devices' },
    { value: '24h → 6h', label: 'support resolution time at an IoT company' },
    { value: '−40%', label: 'support resolution time at a school' },
  ],

  bio: {
    headline: 'Infra and product. Yes, both.',
    body: 'I run IT infrastructure in the education sector and lead product and operations at an AI-powered crowdsourcing platform. I built an offline exam system for 2,000 people at once, keep a campus network at 99.5% uptime, and took a support queue from 24-hour fixes to six. Every layer, same job: find out what the business wants, then make the system do it.',
    short: 'Receipts: support fixes cut from 24 hours to 6, 95% of critical pre-launch issues cleared in UAT, a 1,000+ user network at 99.5% uptime.',
  },

  story: [
    {
      id: 'roots',
      title: 'Arrupe Jesuit University',
      text: 'BSc (Hons) ICT, CGPA 3.63/4.0. Won the Vice Chancellor’s Award for Best Innovation of the Year.',
    },
    {
      id: 'support-manager',
      title: 'IoT fleet tracking company',
      text: 'Intern, then engineer, then manager of an eight-person team supporting 300+ enterprise clients. Fix times dropped from 24 hours to 6.',
    },
    {
      id: 'infrastructure',
      title: 'Education sector',
      text: 'IT infrastructure engineer, still. I keep the network up 99.5% of the time for 1,000+ users on 2,000+ devices, cut support resolution time by 40%, and built the clinic system and the offline exam platform.',
    },
    {
      id: 'product',
      title: 'AI crowdsourcing platform (US, remote)',
      text: 'Product and operations: pricing, payments, automation and a multi-country rollout. Also current.',
    },
  ],

  projects: [
    {
      id: 'crowdsourcing',
      title: 'AI Crowdsourcing Platform',
      subtitle: 'US-based, fully remote. My current role.',
      description:
        "Business goals go in, specs developers can actually build from come out, and I keep sprints on schedule. I designed the tiered pricing that became the platform's revenue engine, worked out the wallet and multi-currency payment logic behind it, and built an n8n automation that feeds live listings to distribution channels. I also coordinate the AI matching and talent discovery features.",
      role: 'Product & Operations Analyst',
      tech: ['Product Strategy', 'Monetisation Design', 'n8n Automation', 'Payment Logic', 'AI Features', 'Growth Mechanics'],
      highlight: 'I designed the pricing that became the revenue engine.',
      layer: 'product',
    },
    {
      id: 'schoolclinic',
      title: 'SchoolClinic',
      subtitle: 'Clinic management system, deployed on-premise',
      description:
        'The clinic ran on paper, and the accounts team lost hours every month reconciling billing. So I mapped how a patient actually moves through the clinic and built the whole system around it: separate workflows for nurses, doctors, lab scientists and pharmacists, running on a server on site. Month-end billing is now one report export.',
      role: 'Architect & Developer',
      tech: ['Next.js 14', 'TypeScript', 'Prisma ORM', 'PostgreSQL 16', 'Role-based Routing', 'On-Premise Server'],
      highlight: 'Month-end billing went from hours to one export.',
      layer: 'application',
      images: ['/clinic-billing.png', '/clinic-pharmacy.png'],
    },
    {
      id: 'cbt',
      title: 'Offline CBT Platform',
      subtitle: '2,000 concurrent users, no internet needed',
      description:
        '2,000 people taking a computer-based exam at once, with no internet to lean on. I built all of it: the database schema, the network layout, the Linux server setup and the application, working from what school leadership, IT staff and the people taking the exam needed.',
      role: 'Infrastructure Engineer',
      tech: ['Linux Servers', 'Database Design', 'Network Design', 'High-Load Concurrency'],
      highlight: 'Zero latency with all 2,000 users online.',
      layer: 'server',
    },
    {
      id: 'legal-ai',
      title: 'Legal Research AI APIs',
      subtitle: 'Top 5 Innovative Startup in Zimbabwe',
      description:
        'I interviewed legal professionals to find out what they actually needed from AI research, then built the backend: Python and Flask, a RAG pipeline, and REST APIs handling 10,000+ requests a day at 99.2% uptime. Redis caching and database indexing cut response times by 60%.',
      role: 'Backend Developer (legal-tech startup)',
      tech: ['Python / Flask', 'REST APIs', 'RAG Pipeline', 'Redis Caching', 'Database Indexing'],
      highlight: '60% faster responses at 10,000+ requests a day.',
      layer: 'application',
    },
    {
      id: 'iot-support',
      title: 'IoT Fleet Tracking Support',
      subtitle: '300+ enterprise clients, 98% SLA compliance',
      description:
        'The clients track vehicles and assets with IoT devices: GPS trackers, fuel sensors, temperature monitors, door sensors. I started as an intern, moved up to the engineer configuring them for enterprise fleets, then managed an eight-person team. We rebuilt triage and the knowledge base, resolution time fell from 24 hours to 6, and the client portfolio grew 40%.',
      role: 'Technical Implementation Manager',
      tech: ['IoT Configuration', 'SLA Management', 'Process Improvement', 'SOP Documentation', 'Enterprise Support'],
      highlight: 'Resolution time cut from 24 hours to 6.',
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
        'UAT',
        'Process Mapping',
        'Gap Analysis',
        'Stakeholder Management',
        'Agile / Scrum',
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
        'LAN/WAN Design',
        'AWS',
        'Azure',
        'Nginx',
        'CCTV / Biometrics / RFID',
      ],
    },
    {
      group: 'Security & Governance',
      items: [
        'CompTIA Security+',
        'ISC2 Certified in Cybersecurity (CC)',
        'Threat & Vulnerability Management',
        'Access Control',
        'Disaster Recovery',
        'Network Security',
        'Firewalls',
        'ITIL',
      ],
    },
    {
      group: 'Automation & DevOps',
      items: [
        'n8n',
        'Docker',
        'Git / GitHub',
        'CI/CD',
        'Postman',
        'JIRA / Confluence',
        'Notion',
        'Figma',
      ],
    },
  ],

  credentials: [
    'Vice Chancellor’s Award for Best Innovation of the Year, Arrupe Jesuit University (BSc ICT, CGPA 3.63/4.0)',
    'CompTIA Security+ (2026)',
    'ISC2 Certified in Cybersecurity, CC (2026)',
    'Stanford Code in Place (2025)',
    'Huawei Seeds for the Future (2023)',
    'Front-End Development, Selfless Hearts Foundation (2024)',
  ],

  contact: {
    email: 'oluseyemichael11@gmail.com',
    phone: '+234 703 723 4416',
    github: 'https://github.com/oluseyemichael',
    linkedin: 'https://www.linkedin.com/in/michael-oluseye-406558216/',
  },
};
