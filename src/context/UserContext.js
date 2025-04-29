import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 🔍 Récupération initiale de l'utilisateur
  useEffect(() => {
    if (typeof window === 'undefined') return; // Protection côté serveur (build)

    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user || null);
      setIsLoadingUser(false);
    };

    fetchUser();
  }, []);

  // ⚡ Suivi des changements d'authentification
  useEffect(() => {
    if (typeof window === 'undefined') return; // Protection côté serveur (build)

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
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