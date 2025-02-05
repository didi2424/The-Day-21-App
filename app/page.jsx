import Navbar from "../components/NavBar/Navbar";
import Provider from "@components/Provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import gaya dari react-toastify
const Home = () => (
  <section className='w-full flex-center flex-col '>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    <Provider>
    <Navbar/>
    <h1 className='head_text text-center'>
      The Day 21 App
      <br className='max-md:hidden' />
      <span className='orange_gradient text-center'> Management App</span>
    </h1>
    <p className='desc text-center'>
      The Day 21 is an management app for Bussiness
    </p>
    </Provider>
  </section>
);

export default Home;