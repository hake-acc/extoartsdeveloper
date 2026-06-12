import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      await fetch('/api/auth-session', { method: 'DELETE' }).catch(() => {});
      router.push('/login');
    })();
  }, []);
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050508',color:'#f0f0f5',fontFamily:'Urbanist,sans-serif'}}>
      Signing out...
    </div>
  );
}
