// app/dashboard/layout.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function LogoutLayout() {

useEffect(() => {
   const userSession = JSON.parse(localStorage.getItem('user') || '{}');
   if (userSession && userSession.name) {
    localStorage.removeItem("user");
    setTimeout(() => {
      window.location.assign("/");
    }, 3000); 
   }
}, [])
  return (
    <>
    <title>
      Log Out 
    </title>

      <div className="z-10 text-center px-6">
        <p className="text-xl">Loading...</p>
       
      </div>
    </>
  );
}
