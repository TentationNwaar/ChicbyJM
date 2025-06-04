import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import { supabase } from '../lib/supabaseClient';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isReady, setIsReady] = useState(false); // 🔒 pour bloquer tant qu'on a pas fetch
  const hasFetchedRef = useRef(false); // 🧠 évite d’écraser supabase avec []
  const prevCartRef = useRef([]);

  const { user, isLoadingUser } = useContext(UserContext);

  // 🛒 Chargement du panier
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || isLoadingUser || hasFetchedRef.current) return;

      const { data, error } = await supabase
        .from('carts')
        .select('items')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn('[fetchCart ❌]', error.message);
      }

      if (data?.items) {
        setCart(data.items);
        prevCartRef.current = data.items;
        console.log('[fetchCart ✅]', data.items);
      } else {
        console.log('[fetchCart ℹ️] Aucun panier trouvé, initialisation vide.');
        setCart([]); // vide si pas trouvé
        prevCartRef.current = [];
      }

      hasFetchedRef.current = true;
      setIsReady(true);
    };

    fetchCart();
  }, [user, isLoadingUser]);

  // 💾 Sauvegarde uniquement si changement
  useEffect(() => {
    const saveCart = async () => {
      if (!user || !isReady) return;

      const prevCart = prevCartRef.current;
      const hasChanged = JSON.stringify(prevCart) !== JSON.stringify(cart);

      if (!hasChanged) return;

      prevCartRef.current = cart;

      const { error } = await supabase.from('carts').upsert({
        user_id: user.id,
        items: cart,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('[saveCart ❌]', error.message);
      } else {
        console.log('[saveCart 💾]', cart);
      }
    };

    saveCart();
  }, [cart, user, isReady]);

  // 🧠 Fonctions panier
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      return existingItem
        ? currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  if (!isReady) return null;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};