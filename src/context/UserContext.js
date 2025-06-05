import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 🔍 Récupération initiale de la session utilisateur
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      setIsLoadingUser(false);
    };

    fetchUser();
  }, []);

  // ⚡ Suivi des changements d'authentification
  useEffect(() => {
    if (typeof window === 'undefined') return;
  
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
  
      // ⛔ NE PAS toucher au user tant que la session n’est pas claire
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        setUser(session.user);
        setIsLoadingUser(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoadingUser(false);
      }
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