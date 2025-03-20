import Navbar from "../components/NavBar/Navbar";
import Provider from "@components/Provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => (
  <>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    <Provider>
      <Navbar className=''/>
      <section className='w-full min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#1E1B4B] '>
        {/* Hero Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-4 text-white'>
              The Day 21
              <br className='max-md:hidden' />
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'> Management App</span>
            </h1>
            <p className='desc max-w-2xl mx-auto mb-10 text-gray-300'>
              Streamline your business operations and boost productivity with our comprehensive management solution
            </p>
            <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all'>
              Get Started
            </button>
          </div>

          {/* Features Section */}
          <div className='mt-24 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-[#1a1a2e] backdrop-blur-lg bg-opacity-50 p-6 rounded-lg border border-[#2a2a4e] hover:border-blue-500 transition-all'>
              <div className='text-[#FF5555] text-4xl mb-4'>📊</div>
              <h3 className='text-xl font-semibold mb-2 text-white'>Analytics Dashboard</h3>
              <p className='text-gray-400'>Real-time insights into your business performance</p>
            </div>
            <div className='bg-[#1a1a2e] backdrop-blur-lg bg-opacity-50 p-6 rounded-lg border border-[#2a2a4e] hover:border-blue-500 transition-all'>
              <div className='text-[#FF5555] text-4xl mb-4'>📱</div>
              <h3 className='text-xl font-semibold mb-2 text-white'>Mobile Friendly</h3>
              <p className='text-gray-400'>Manage your business from anywhere, anytime</p>
            </div>
            <div className='bg-[#1a1a2e] backdrop-blur-lg bg-opacity-50 p-6 rounded-lg border border-[#2a2a4e] hover:border-blue-500 transition-all'>
              <div className='text-[#FF5555] text-4xl mb-4'>🔒</div>
              <h3 className='text-xl font-semibold mb-2 text-white'>Secure Platform</h3>
              <p className='text-gray-400'>Enterprise-grade security for your data</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#2a2a4e]'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Trusted by Growing Businesses
            </h2>
            <p className='text-gray-400 max-w-2xl mx-auto'>
              Join thousands of businesses that use The Day 21 App to streamline their operations
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold mb-2'>
                5000+
              </div>
              <p className='text-gray-400'>Active Users</p>
            </div>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold mb-2'>
                98%
              </div>
              <p className='text-gray-400'>Customer Satisfaction</p>
            </div>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold mb-2'>
                24/7
              </div>
              <p className='text-gray-400'>Support Available</p>
            </div>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold mb-2'>
                50+
              </div>
              <p className='text-gray-400'>Countries Served</p>
            </div>
          </div>

          <div className='mt-20 text-center bg-[#1a1a2e] backdrop-blur-lg bg-opacity-50 p-12 rounded-lg border border-[#2a2a4e]'>
            <h3 className='text-2xl font-bold text-white mb-4'>Ready to Get Started?</h3>
            <p className='text-gray-400 mb-8'>Start your 14-day free trial. No credit card required.</p>
            <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all'>
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <footer className='border-t border-[#2a2a4e] mt-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
              <div>
                <h4 className='text-white font-bold mb-4'>About</h4>
                <ul className='space-y-2'>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Company</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Team</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className='text-white font-bold mb-4'>Resources</h4>
                <ul className='space-y-2'>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Documentation</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Help Center</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className='text-white font-bold mb-4'>Legal</h4>
                <ul className='space-y-2'>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Privacy Policy</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Terms of Service</a></li>
                  <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>Cookie Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className='text-white font-bold mb-4'>Connect</h4>
                <div className='flex space-x-4'>
                  <a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                  <a href="#" className='text-gray-400 hover:text-purple-400 transition-colors'>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.082 18.708c-.699.699-1.5 1.248-2.398 1.638-0.916.396-1.898.594-2.914.594s-1.998-.198-2.914-.594c-.898-.39-1.699-.939-2.398-1.638-.699-.699-1.248-1.5-1.638-2.398C4.428 15.394 4.23 14.412 4.23 13.396s.198-1.998.594-2.914c.39-.898.939-1.699 1.638-2.398.699-.699 1.5-1.248 2.398-1.638C9.776 6.052 10.758 5.854 11.774 5.854s1.998.198 2.914.594c.898.39 1.699.939 2.398 1.638.699.699 1.248 1.5 1.638 2.398.396.916.594 1.898.594 2.914s-.198 1.998-.594 2.914c-.39.898-.939 1.699-1.638 2.398z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className='pt-8 border-t border-[#2a2a4e] text-center'>
              <p className='text-gray-400'>&copy; 2025 The Day 21 App. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </section>
    </Provider>
  </>
);

export default Home;