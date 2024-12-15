import project1 from "../assets/projects/project-1.png";
// import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.png";
import pathED from "../assets/projects/pathED.png";

export const HERO_CONTENT = `I am a passionate full stack developer dedicated to crafting robust and scalable web applications. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I am a dedicated and versatile developer with a passion for 
creating efficient and user-friendly web applications. 
As a first class graduate of ICT, 
I have honed my skills in technologies like Flask, Python, network design, and cloud computing. 
My journey in web development began with a deep curiosity for how things work, and 
it is evolving into a career where I continuously strive to learn and adapt to new challenges. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality solutions. Outside of coding, I enjoy staying active by playing chess, table tennis, and football. I also love exploring new technologies.`;

export const EXPERIENCES = [
  {
    year: "Aug 2024 - Dec 2024",
    role: "IT Technician",
    company: "Taffiecomms Pvt Ltd",
    description: `IoT device configuration, system issue identification and resolution, and system training. Played a key role in ensuring system efficiency, client satisfaction, and knowledge transfer within the team.`,
    technologies: ["CMS", "Tracking System Software", "Linux", "Device Configurators"],
  },
  {
    year: "June 2024 - Aug 2024",
    role: "Full Stack Developer Intern",
    company: "Internpulse",
    description: `Backend Development: Partnered with a team of developers to build a robust set of micro-service RESTful APIs for a fintect product. \n
    Frontend Development: Led the frontend team to develop the UI and integration APIs for https://famtrust-frontend-five.vercel.app/.`,
    technologies: ["HTML", "Javascript", "React.js", "Tailwind CSS", "Python", "Django", "Git & Github"],
  },
  {
    year: "2023",
    role: "IT Intern",
    company: "Taffiecomms Pvt Ltd",
    description: `lorem Ipsum`,
    technologies: ["Python", "Linux", "Excel", "MySQL"],
  },
  {
    year: "2020",
    role: "Web Development Intern",
    company: "ISSL",
    description: `Learnt the basics of web development.`,
    technologies: ["HTML", "CSS"],
  },
];

export const PROJECTS = [
  {
    title: "PathED",
    //change
    image: pathED,
    description:
      "All in one self learning platform",
    technologies: ["HTML", "CSS", "Python", "Django"],
    link: ["https://path-ed.vercel.app/"]
  },
  {
    title: "University Chatbot",
    image: project1,
    description:
      "An enquiry chatbot for a university",
    technologies: ["HTML", "CSS", "Python", "Flask"],
  },
  {
    title: "Map Locator",
    // image: project2,
    description:
      "A flask app for point out any location",
    technologies: ["HTML", "CSS", "Python", "Django"],
  },
  {
    title: "Portfolio Website",
    image: project3,
    description:
      "A personal portfolio website showcasing projects, skills, and contact information.",
    technologies: ["HTML", "CSS", "React", "Tailwind"],
  },
];

export const CONTACT = {
  address: "Harare, Zimbabwe ",
  phoneNo: "+263 780044062, +234 8176577730 ",
  email: "bigmike11100@gmail.com",
};