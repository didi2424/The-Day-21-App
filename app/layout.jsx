import "@styles/globals.css";
export const metadata = {
  title: "The Day 21 App",
  description: "Manajement App",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
      
          <main className="app bg-[#f7f7f7] ">
            {children}
          </main>

      </body>
    </html>
  );
};

export default RootLayout;
