// app/dashboard/layout.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function LogoutLayout() {

useEffect(() => {
   const userSession = JSON.parse(localStorage.getItem('user') || '{}');
   if (userSession && userSession.name) {
    localStorage.removeItem("user");
    window.location.assign("/");
   }
}, [])
  return (
    <>
    <title>
      Log Out 
    </title>
   
    </>
  );
}
