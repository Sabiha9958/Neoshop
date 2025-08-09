import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Github,
  Zap,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' }
    ]
  };

  const features = [
    { icon: Shield, title: 'Secure Shopping', desc: 'Military-grade encryption' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Quantum speed shipping' },
    { icon: CreditCard, title: 'Safe Payments', desc: 'Blockchain secured' },
    { icon: Zap, title: '24/7 Support', desc: 'AI-powered assistance' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/neoshop', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/neoshop', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/neoshop', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/neoshop', label: 'GitHub' }
  ];

  return (
    <footer className="bg-cyber-darker border-t border-neon-blue/20">
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white" size={24} />
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-cyber font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-cyber text-glow bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                NeoShop
              </span>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Experience the future of e-commerce with our cutting-edge platform. 
              Shop with confidence in the cyber age.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Mail className="mr-3 text-neon-blue" size={16} />
                <span>support@neoshop.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="mr-3 text-neon-blue" size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="mr-3 text-neon-blue" size={16} />
                <span>Cyber City, Digital District</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-cyber-light/30 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-cyber">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-cyber">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-cyber">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-neon-blue/20 pt-8 mt-12">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Get the latest updates on futuristic products and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-cyber-light/30 border border-neon-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-cyber px-6 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-blue/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} NeoShop. All rights reserved. Built for the future.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ⚡ by NeoShop Team</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
