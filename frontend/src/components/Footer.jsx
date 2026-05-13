import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-dark-800 dark:bg-dark-900 text-gray-300 dark:text-gray-400 border-t border-gray-700 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 py-12'>
          <div>
            <h3 className='text-lg font-bold text-white mb-4'>Shopify</h3>
            <p className='text-sm leading-relaxed'>
              Your ultimate destination for quality products and exceptional shopping experience.
            </p>
          </div>

          <div>
            <h3 className='text-lg font-bold text-white mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link to='/' className='hover:text-blue-400 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/page/1' className='hover:text-blue-400 transition-colors'>
                  Products
                </Link>
              </li>
              <li>
                <Link to='/cart' className='hover:text-blue-400 transition-colors'>
                  Cart
                </Link>
              </li>
              <li>
                <Link to='/profile' className='hover:text-blue-400 transition-colors'>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-bold text-white mb-4'>Customer Service</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='mailto:arseniic8@gmail.com' className='hover:text-blue-400 transition-colors'>
                  Contact here
                </a>
              </li>
              <li>
                <Link to='/profile' className='hover:text-blue-400 transition-colors'>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to='/profile' className='hover:text-blue-400 transition-colors'>
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className='text-lg font-bold text-white mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a
                href='https://www.facebook.com'
                aria-label='Facebook'
                target='_blank'
                rel='noreferrer'
                className='text-gray-400 hover:text-blue-400 transition-colors text-xl'
              >
                <FaFacebook />
              </a>
              <a
                href='https://www.twitter.com'
                aria-label='Twitter'
                target='_blank'
                rel='noreferrer'
                className='text-gray-400 hover:text-blue-400 transition-colors text-xl'
              >
                <FaTwitter />
              </a>
              <a
                href='https://www.instagram.com'
                aria-label='Instagram'
                target='_blank'
                rel='noreferrer'
                className='text-gray-400 hover:text-blue-400 transition-colors text-xl'
              >
                <FaInstagram />
              </a>
              <a
                href='https://www.linkedin.com'
                aria-label='LinkedIn'
                target='_blank'
                rel='noreferrer'
                className='text-gray-400 hover:text-blue-400 transition-colors text-xl'
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className='border-gray-700 dark:border-gray-800' />

        {/* Copyright */}
        <div className='py-6 text-center text-sm text-gray-400'>
          <p>
            Shopify &copy; {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;