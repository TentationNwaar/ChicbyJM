import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 🔍 1. Récupération initiale de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      console.log('🔍 [fetchUser] user =', user);
      if (error) console.error('❌ [fetchUser] error =', error);

      setUser(user || null);
      setIsLoadingUser(false);
    };

    fetchUser();
  }, []);

  // ⚡ 2. Suivi des changements d'authentification (login/logout)
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('⚡ [onAuthStateChange] event =', event);
      console.log('📦 [onAuthStateChange] session =', session);

      if (session) {
        setUser(session.user);

        // 🧪 DEBUG : stocker les tokens localement
        localStorage.setItem('access_token', session.access_token);
        localStorage.setItem('refresh_token', session.refresh_token);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }

      setIsLoadingUser(false);
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};