import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-gray-950 border-t border-slate-800 dark:border-gray-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold gradient-text-primary mb-3">AuthSphere</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
              Modern authentication and user management system built with security and scalability in mind.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white dark:hover:text-indigo-400 transition-all hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white dark:hover:text-indigo-400 transition-all hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@authsphere.com" className="p-2 text-gray-400 hover:text-white dark:hover:text-indigo-400 transition-all hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/auth" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-indigo-400 transition-colors">
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © {currentYear} AuthSphere. All rights reserved.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> by AuthSphere Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
