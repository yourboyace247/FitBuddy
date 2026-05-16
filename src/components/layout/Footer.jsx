import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaTiktok 
} from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { 
      icon: <FaFacebook className="h-5 w-5" />, 
      url: "https://facebook.com/fitbuddy",
      label: "Facebook"
    },
    { 
      icon: <FaTwitter className="h-5 w-5" />, 
      url: "https://twitter.com/fitbuddy",
      label: "Twitter"
    },
    { 
      icon: <FaInstagram className="h-5 w-5" />, 
      url: "https://instagram.com/fitbuddy",
      label: "Instagram"
    },
    { 
      icon: <FaYoutube className="h-5 w-5" />, 
      url: "https://youtube.com/fitbuddy",
      label: "YouTube"
    },
    { 
      icon: <FaTiktok className="h-5 w-5" />, 
      url: "https://tiktok.com/@fitbuddy",
      label: "TikTok"
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Fit Buddy. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/terms" className="text-sm hover:text-cyan-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/about" className="text-sm hover:text-cyan-300 transition-colors">
              About Us
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors transform hover:scale-110"
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}