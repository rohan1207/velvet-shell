'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '@/lib/products';

const StoreContext = createContext(null);
const CART_KEY = 'velvet-shell-cart';
const WISH_KEY = 'velvet-shell-wish';

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      const savedWish = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
      if (Array.isArray(savedCart)) setCart(savedCart);
      if (Array.isArray(savedWish)) setWishlist(savedWish);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, cartOpen, searchOpen]);

  const value = useMemo(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => {
      const product = getProduct(item.slug);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);

    function addToCart(slug, options = {}) {
      const { size = 'One size', metal = '18k Champagne Gold', qty = 1 } = options;
      setCart((current) => {
        const existing = current.find(
          (item) => item.slug === slug && item.size === size && item.metal === metal
        );
        if (existing) {
          return current.map((item) =>
            item === existing ? { ...item, qty: item.qty + qty } : item
          );
        }
        return [...current, { id: `${slug}-${size}-${metal}`, slug, size, metal, qty }];
      });
      setCartOpen(true);
    }

    function updateQty(id, qty) {
      setCart((current) =>
        qty <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }

    function removeFromCart(id) {
      setCart((current) => current.filter((item) => item.id !== id));
    }

    function clearCart() {
      setCart([]);
    }

    function toggleWishlist(slug) {
      setWishlist((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));
    }

    return {
      cart,
      wishlist,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
    };
  }, [cart, wishlist, cartOpen, searchOpen, menuOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
