import logo from '../assets/MichaelOluseyeLogo.png';
// Import icons
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'
import { BsTwitterX } from "react-icons/bs";

const Navbar = () => {
  return (
    <nav className='mb-20 flex items-center justify-between py-6'>
      <div className='flex flex-shrink-0 items-center'>
        {/* Display Logo */}
        <img src={logo} alt="logo" width={100} height={100} />
      </div>
      {/* Nav Links */}
      <div className='font-serif sm:mr-0.1'>
        <ul className='m-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-1xl'>
        <li><a href="#home" className="hover:text-purple-600 hover:font-bold hover:font-mono">Home</a></li>
          <li><a href="#aboutMe" className="hover:text-purple-600 hover:font-bold hover:font-mono">About</a></li>
          <li><a href="#technologies" className="hover:text-purple-600 hover:font-bold hover:font-mono">Technologies</a></li>
          <li><a href="#experience" className="hover:text-purple-600 hover:font-bold hover:font-mono">Experience</a></li>
          <li><a href="#projects" className="hover:text-purple-600 hover:font-bold hover:font-mono">Projects</a></li>
          <li><a href="#contact" className="hover:text-purple-600 hover:font-bold hover:font-mono">Contact</a></li>
        </ul>
      </div>
      {/* Display Icons */}
      <div className='m-8 flex flex-col lg:flex-row items-center justify-center gap-4 text-2xl'>
        <a href="https://www.linkedin.com/in/oluseye-michael-406558216/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://github.com/oluseyemichael" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/bigmike11100" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          <BsTwitterX />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;