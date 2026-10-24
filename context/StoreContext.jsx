'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct as getDummyProduct } from '@/lib/products';
import { productImageSrc } from '@/lib/product-image';

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

async function authFetch(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function syncAccountData(setAddresses, setSelectedAddressId, setOrders) {
  try {
    const [addrRes, orderRes] = await Promise.all([
      fetch('/api/addresses', { credentials: 'same-origin' }),
      fetch('/api/orders', { credentials: 'same-origin' }),
    ]);
    const addrData = await addrRes.json().catch(() => ({}));
    const orderData = await orderRes.json().catch(() => ({}));
    if (addrRes.ok && Array.isArray(addrData.addresses)) {
      setAddresses(addrData.addresses);
      const def =
        addrData.addresses.find((a) => a.isDefault)?.id ||
        addrData.addresses[0]?.id ||
        null;
      if (def) setSelectedAddressId(def);
    }
    if (orderRes.ok && Array.isArray(orderData.orders)) {
      setOrders(orderData.orders);
    }
  } catch {
    /* keep local cache */
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
  const [catalog, setCatalog] = useState({
    products: [],
    allProducts: [],
    colorFamilies: [],
    collections: [],
    source: 'dummy',
  });

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const savedCart = loadJson(CART_KEY, []);
      const savedWish = loadJson(WISH_KEY, []);
      const savedOrders = loadJson(ORDERS_KEY, []);
      const savedAddresses = loadJson(ADDR_KEY, []);
      const savedSelected = localStorage.getItem(SELECTED_ADDR_KEY);

      if (Array.isArray(savedCart)) setCart(savedCart);
      if (Array.isArray(savedWish)) setWishlist(savedWish);
      if (Array.isArray(savedOrders)) setOrders(savedOrders);
      if (Array.isArray(savedAddresses)) setAddresses(savedAddresses);
      if (savedSelected) setSelectedAddressId(savedSelected);

      // Drop legacy local demo user (may contain plaintext password)
      try {
        localStorage.removeItem(USER_KEY);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data.user) {
          setUser(data.user);
          await syncAccountData(setAddresses, setSelectedAddressId, setOrders);
        }
      } catch {
        /* offline / misconfigured — stay signed out */
      }

      try {
        const res = await fetch('/api/catalog');
        const data = await res.json().catch(() => ({}));
        if (!cancelled && (data.products?.length || data.allProducts?.length)) {
          const allProducts = data.allProducts || data.products || [];
          setCatalog({
            products: data.products || [],
            allProducts,
            colorFamilies: data.colorFamilies || [],
            collections: data.collections || [],
            source: data.source || 'supabase',
          });
          // Refresh cart thumbnails from live catalog (R2 URLs), not stale localStorage paths
          setCart((current) => {
            if (!Array.isArray(current) || !current.length) return current;
            let changed = false;
            const next = current.map((item) => {
              const product =
                allProducts.find((p) => p.slug === item.slug) ||
                (data.products || []).find((p) => p.slug === item.slug);
              if (!product) return item;
              const image = productImageSrc(product);
              if (!image || image === item.image) return item;
              changed = true;
              return {
                ...item,
                image,
                name: product.name || item.name,
                price: product.price ?? item.price,
              };
            });
            return changed ? next : current;
          });
        }
      } catch {
        /* keep dummy fallback via getDummyProduct */
      }

      if (!cancelled) setReady(true);
    }

    hydrate();
    return () => {
      cancelled = true;
    };
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
    function getProduct(slug) {
      return (
        catalog.allProducts.find((p) => p.slug === slug) ||
        catalog.products.find((p) => p.slug === slug) ||
        getDummyProduct(slug)
      );
    }

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
        customization = [],
      } = options;
      const image = productImageSrc(product);
      const name = product?.name || slug;
      const price = product?.price || 0;
      const customEntries = Array.isArray(customization)
        ? customization
            .map((entry) => ({
              id: String(entry?.id || ''),
              label: String(entry?.label || '').trim(),
              value: String(entry?.value ?? '').trim(),
            }))
            .filter((entry) => entry.label && entry.value)
        : [];
      const customKey = customEntries
        .map((entry) => `${entry.id}:${entry.value}`)
        .join('|');
      setCart((current) => {
        const existing = current.find(
          (item) =>
            item.slug === slug &&
            item.size === size &&
            item.metal === metal &&
            (item.customKey || '') === customKey,
        );
        if (existing) {
          return current.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  qty: item.qty + qty,
                  // Always refresh from live catalog (R2), not stale cart snapshot
                  image: image || item.image,
                  name: name || item.name,
                  price: price || item.price,
                  customization: item.customization?.length
                    ? item.customization
                    : customEntries,
                }
              : item
          );
        }
        return [
          ...current,
          {
            id: `${slug}-${size}-${metal}${customKey ? `-${customKey}` : ''}`,
            slug,
            size,
            metal,
            qty,
            image,
            name,
            price,
            customization: customEntries,
            customKey,
          },
        ];
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

    async function login({ identifier, email, phone, password }) {
      const data = await authFetch('/api/auth/login', {
        identifier: identifier || email || phone,
        password,
      });
      setUser(data.user || null);
      await syncAccountData(setAddresses, setSelectedAddressId, setOrders);
      return data.user;
    }

    async function register(payload) {
      const data = await authFetch('/api/auth/register', payload);
      setUser(data.user || null);
      await syncAccountData(setAddresses, setSelectedAddressId, setOrders);
      return data;
    }

    async function logout() {
      try {
        await authFetch('/api/auth/logout', {});
      } catch {
        /* still clear local session */
      }
      setUser(null);
      setAddresses([]);
      setOrders([]);
      setSelectedAddressId(null);
    }

    async function updateProfile(patch) {
      const data = await authFetch('/api/auth/update-profile', patch);
      if (data.user) setUser(data.user);
      return data.user;
    }

    async function changePassword(currentPassword, nextPassword) {
      try {
        const data = await authFetch('/api/auth/change-password', {
          currentPassword,
          nextPassword,
        });
        if (data.user) setUser(data.user);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message || 'Could not change password.' };
      }
    }

    async function requestPasswordReset(identifier) {
      return authFetch('/api/auth/forgot-password', { identifier });
    }

    async function resetPassword({ identifier, code, password, signIn = true }) {
      const data = await authFetch('/api/auth/reset-password', {
        identifier,
        code,
        password,
        signIn,
      });
      if (data.user) setUser(data.user);
      return data;
    }

    async function addAddress(address) {
      // Prefer API when session cookies exist (works right after register before re-render)
      try {
        const data = await authFetch('/api/addresses', address);
        const saved = data.address;
        setAddresses((current) => {
          const list = saved.isDefault
            ? current.map((item) => ({ ...item, isDefault: false }))
            : current;
          return [...list.filter((a) => a.id !== saved.id), saved];
        });
        if (saved.isDefault || !selectedAddressId) setSelectedAddressId(saved.id);
        return saved.id;
      } catch (err) {
        if (err.status !== 401) throw err;
      }
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

    async function updateAddress(id, patch) {
      if (user && !String(id).startsWith('addr-')) {
        const existing = addresses.find((a) => a.id === id) || {};
        const res = await fetch(`/api/addresses/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ ...existing, ...patch }),
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || 'Could not update address.');
        const saved = payload.address;
        setAddresses((current) =>
          current.map((item) => {
            if (item.id !== id) {
              return saved.isDefault ? { ...item, isDefault: false } : item;
            }
            return saved;
          }),
        );
        if (saved.isDefault) setSelectedAddressId(id);
        return;
      }
      setAddresses((current) =>
        current.map((item) => {
          if (item.id !== id) {
            return patch.isDefault ? { ...item, isDefault: false } : item;
          }
          return { ...item, ...patch };
        }),
      );
      if (patch.isDefault) setSelectedAddressId(id);
    }

    async function removeAddress(id) {
      if (user && !String(id).startsWith('addr-')) {
        const res = await fetch(`/api/addresses/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || 'Could not remove address.');
      }
      setAddresses((current) => current.filter((item) => item.id !== id));
      setSelectedAddressId((current) => (current === id ? null : current));
    }

    function selectAddress(id) {
      setSelectedAddressId(id);
      setAddresses((current) =>
        current.map((item) => ({ ...item, isDefault: item.id === id })),
      );
      if (user && !String(id).startsWith('addr-')) {
        fetch(`/api/addresses/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(
            addresses.find((a) => a.id === id)
              ? { ...addresses.find((a) => a.id === id), isDefault: true }
              : { isDefault: true },
          ),
        }).catch(() => {});
      }
    }

    async function placeOrder(order) {
      const cartItems = order.items || [];
      const enriched = cartItems.map((item) => {
        const product = getProduct(item.slug);
        return {
          ...item,
          name: product?.name || item.name || item.slug,
          image: productImageSrc(product, item),
          price: product?.price ?? item.price,
        };
      });

      try {
        const data = await authFetch('/api/orders', {
          items: enriched,
          shipping: order.shipping,
          email: order.email || user?.email,
          paymentId: order.paymentId,
          razorpayOrderId: order.razorpayOrderId,
          razorpaySignature: order.razorpaySignature,
          demo: order.demo,
          subtotal: order.subtotal ?? order.total,
          shippingFee: order.shippingFee || 0,
          total: order.total,
        });
        const next = data.order;
        setOrders((current) => [next, ...current.filter((o) => o.id !== next.id)]);
        clearCart();
        return next;
      } catch (err) {
        if (err.status !== 401) throw err;
      }

      const next = {
        id: order.id || `VS${Date.now().toString().slice(-8)}`,
        orderNumber: order.id,
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || 'Confirmed',
        total: order.total,
        items: enriched,
        shipping: order.shipping,
        paymentId: order.paymentId || null,
        paymentMethod: order.paymentMethod || 'Razorpay',
        email: order.email || user?.email || '',
      };
      setOrders((current) => [next, ...current]);
      clearCart();
      return next;
    }

    async function refreshOrders() {
      await syncAccountData(setAddresses, setSelectedAddressId, setOrders);
    }

    const selectedAddress =
      addresses.find((item) => item.id === selectedAddressId) ||
      addresses.find((item) => item.isDefault) ||
      null;

    return {
      ready,
      catalog,
      getProduct,
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
      register,
      logout,
      updateProfile,
      changePassword,
      requestPasswordReset,
      resetPassword,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
      placeOrder,
      refreshOrders,
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
    catalog,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
