"use client";
import { usePathname } from "next/navigation";
import "./styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

// app/layout.tsx or app/page.tsx (if no custom layout is used)
import Head from 'next/head';
import Sidebar from "./components/home/sidebar";
import Topbar from "./components/home/topbar";
import UserSidebar from "./components/home/usersiderbar";
import UserTopbar from "./components/home/usertopbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashLayout = pathname.startsWith("/dash");
  const isEmployeerDash = pathname.startsWith("/employeer");

  return (
    <>
    <html>
      <Head>
        <meta name="application-name" content="Doctor Appointment" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
      <body> 
        { isEmployeerDash ? (
           <div className="flex min-h-screen">
               <Sidebar />
               <Topbar />
               <main className="mt-[50px] ml-[200px] p-7 w-full">{children}</main> 
            </div>
        ) : isDashLayout ? (
           <div className="flex min-h-screen">
               <UserSidebar />
               <UserTopbar />
               <main className="mt-[50px] ml-[200px] p-7 w-full">{children}</main> 
            </div>
        ) : (
         <>
            <main>{children}</main>
          </> 
      )}
      </body>
      </html>
    </>
  );
}
