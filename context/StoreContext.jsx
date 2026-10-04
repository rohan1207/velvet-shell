'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '@/lib/products';

const StoreContext = createContext(null);

const CART_KEY = 'velvet-shell-cart';
const WISH_KEY = 'velvet-shell-wish';
const USER_KEY = 'velvet-shell-user';
const ORDERS_KEY = 'velvet-shell-orders';
const ADDR_KEY = 'velvet-shell-addresses';
const SELECTED_ADDR_KEY = 'velvet-shell-selected-address';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedCart = loadJson(CART_KEY, []);
    const savedWish = loadJson(WISH_KEY, []);
    const savedUser = loadJson(USER_KEY, null);
    const savedOrders = loadJson(ORDERS_KEY, []);
    const savedAddresses = loadJson(ADDR_KEY, []);
    const savedSelected = localStorage.getItem(SELECTED_ADDR_KEY);

    if (Array.isArray(savedCart)) setCart(savedCart);
    if (Array.isArray(savedWish)) setWishlist(savedWish);
    if (savedUser && typeof savedUser === 'object') setUser(savedUser);
    if (Array.isArray(savedOrders)) setOrders(savedOrders);
    if (Array.isArray(savedAddresses)) setAddresses(savedAddresses);
    if (savedSelected) setSelectedAddressId(savedSelected);

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
    if (!ready) return;
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
  }, [addresses, ready]);

  useEffect(() => {
    if (!ready) return;
    if (selectedAddressId) localStorage.setItem(SELECTED_ADDR_KEY, selectedAddressId);
    else localStorage.removeItem(SELECTED_ADDR_KEY);
  }, [selectedAddressId, ready]);

  useEffect(() => {
    const locked = menuOpen || cartOpen || searchOpen || Boolean(quickViewSlug);
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, cartOpen, searchOpen, quickViewSlug]);

  const value = useMemo(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => {
      const product = getProduct(item.slug);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);

    function addToCart(slug, options = {}) {
      const product = getProduct(slug);
      const {
        size = product?.sizes?.[0] || 'One size',
        metal = product?.metal?.[0] || 'S925 Silver',
        qty = 1,
      } = options;
      setCart((current) => {
        const existing = current.find(
          (item) => item.slug === slug && item.size === size && item.metal === metal
        );
        if (existing) {
          return current.map((item) =>
            item.id === existing.id ? { ...item, qty: item.qty + qty } : item
          );
        }
        return [...current, { id: `${slug}-${size}-${metal}`, slug, size, metal, qty }];
      });
      setCartOpen(true);
      setQuickViewSlug(null);
    }

    function updateQty(id, qty) {
      setCart((current) =>
        qty <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }

    function removeFromCart(id) {
      setCart((current) => current.filter((item) => item.id !== id));
    }

    function clearCart() {
      setCart([]);
    }

    function toggleWishlist(slug) {
      setWishlist((current) =>
        current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
      );
    }

    function openQuickView(slug) {
      setQuickViewSlug(slug);
    }

    function closeQuickView() {
      setQuickViewSlug(null);
    }

    function login({ email, password, firstName = '', lastName = '' }) {
      const existing = loadJson(USER_KEY, null);
      const next = {
        email: String(email).trim().toLowerCase(),
        password: String(password),
        firstName: firstName || existing?.firstName || email.split('@')[0] || 'Guest',
        lastName: lastName || existing?.lastName || '',
        phone: existing?.phone || '',
        createdAt: existing?.createdAt || new Date().toISOString(),
      };
      setUser(next);
      return next;
    }

    function logout() {
      setUser(null);
    }

    function updateProfile(patch) {
      setUser((current) => (current ? { ...current, ...patch } : current));
    }

    function changePassword(currentPassword, nextPassword) {
      if (!user) return { ok: false, error: 'Please sign in first.' };
      if (user.password !== currentPassword) {
        return { ok: false, error: 'Current password does not match.' };
      }
      if (!nextPassword || nextPassword.length < 4) {
        return { ok: false, error: 'New password should be at least 4 characters.' };
      }
      setUser((current) => ({ ...current, password: nextPassword }));
      return { ok: true };
    }

    function addAddress(address) {
      const id = `addr-${Date.now()}`;
      const next = { id, ...address };
      setAddresses((current) => {
        const list = address.isDefault
          ? current.map((item) => ({ ...item, isDefault: false }))
          : current;
        return [...list, next];
      });
      if (address.isDefault || !selectedAddressId) setSelectedAddressId(id);
      return id;
    }

    function updateAddress(id, patch) {
      setAddresses((current) =>
        current.map((item) => {
          if (item.id !== id) {
            return patch.isDefault ? { ...item, isDefault: false } : item;
          }
          return { ...item, ...patch };
        })
      );
      if (patch.isDefault) setSelectedAddressId(id);
    }

    function removeAddress(id) {
      setAddresses((current) => current.filter((item) => item.id !== id));
      setSelectedAddressId((current) => (current === id ? null : current));
    }

    function selectAddress(id) {
      setSelectedAddressId(id);
      setAddresses((current) =>
        current.map((item) => ({ ...item, isDefault: item.id === id }))
      );
    }

    function placeOrder(order) {
      const next = {
        id: order.id,
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || 'Confirmed',
        total: order.total,
        items: order.items,
        shipping: order.shipping,
        paymentId: order.paymentId || null,
        paymentMethod: order.paymentMethod || 'Razorpay',
        email: order.email || user?.email || '',
      };
      setOrders((current) => [next, ...current]);
      clearCart();
      return next;
    }

    const selectedAddress =
      addresses.find((item) => item.id === selectedAddressId) ||
      addresses.find((item) => item.isDefault) ||
      null;

    return {
      ready,
      cart,
      wishlist,
      user,
      orders,
      addresses,
      selectedAddressId,
      selectedAddress,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      quickViewSlug,
      openQuickView,
      closeQuickView,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      login,
      logout,
      updateProfile,
      changePassword,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
      placeOrder,
    };
  }, [
    cart,
    wishlist,
    user,
    orders,
    addresses,
    selectedAddressId,
    cartOpen,
    searchOpen,
    menuOpen,
    quickViewSlug,
    ready,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
