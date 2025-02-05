import "@styles/globals.css";
export const metadata = {
  title: "The Day 21 App",
  description: "Manajement App",
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      
      <body>
      
          <main className="app bg-[#f7f7f7] ">
            {children}
          </main>
          <ToastContainer  />
      </body>
    </html>
  );
};

export default RootLayout;
