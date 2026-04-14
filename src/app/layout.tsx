import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./GlobalRedux/provider";
import Sidebar from "./components/Sidebar2";
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 icons:{
icon: "/bomboo.svg",
 },

  title: "Bomboo World - Admin Panel",
  description: "Admin Panel for Bomboo World E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

      <div className='flex '>
      
      <main className="flex-1">
      <Providers>
        <ProtectedRouteWrapper>
          {children}
        </ProtectedRouteWrapper>
      </Providers>

      </main>
    </div>


       

        
    
        </body>
    </html>
  );
}
