'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
  const [promo, setPromo] = useState(null); // { code, discountAmount, label, name, discountId }
  const [promoError, setPromoError] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);
  const [catalog, setCatalog] = useState({
    products: [],
    allProducts: [],
    colorFamilies: [],
    collections: [],
    categories: [],
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

      // Unlock UI immediately — don't wait on auth/catalog network.
      if (!cancelled) setReady(true);

      const authPromise = (async () => {
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
      })();

      const catalogPromise = (async () => {
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
              categories: data.categories || [],
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
          /* keep empty catalog until next refresh */
        }
      })();

      await Promise.all([authPromise, catalogPromise]);
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
    if (!locked) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };
    const scrollbar = Math.max(0, window.innerWidth - html.clientWidth);

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    if (scrollbar) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.paddingRight = prev.bodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen, cartOpen, searchOpen, quickViewSlug]);

  // Keep promo in sync when bag changes (qty / items).
  useEffect(() => {
    if (!promo?.code) return undefined;
    if (!cart.length) {
      setPromo(null);
      return undefined;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const items = cart.map((item) => {
          const product =
            catalog.allProducts.find((p) => p.slug === item.slug) ||
            catalog.products.find((p) => p.slug === item.slug);
          return {
            slug: item.slug,
            qty: item.qty,
            price: product?.price ?? item.price ?? 0,
            category: product?.category || '',
            collection: product?.collection || '',
          };
        });
        const res = await fetch('/api/discounts/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: promo.code,
            items,
            email: user?.email || '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setPromo(null);
          setPromoError(data.error || 'Promo no longer applies to this bag.');
          return;
        }
        setPromo({
          code: data.code,
          discountId: data.discountId,
          discountAmount: data.discountAmount,
          label: data.label,
          name: data.name,
        });
        setPromoError('');
      } catch {
        /* keep current promo until next attempt */
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revalidate on cart shape / code only
  }, [cart, promo?.code, catalog.allProducts, catalog.products, user?.email]);

  const value = useMemo(() => {
    function getProduct(slug) {
      return (
        catalog.allProducts.find((p) => p.slug === slug) ||
        catalog.products.find((p) => p.slug === slug) ||
        null
      );
    }

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => {
      const product = getProduct(item.slug);
      const price = product?.price ?? item.price ?? 0;
      return sum + price * item.qty;
    }, 0);
    const discountAmount = Math.min(
      cartTotal,
      Math.max(0, Number(promo?.discountAmount) || 0),
    );
    const cartPayable = Math.max(0, cartTotal - discountAmount);

    function buildCartLine(slug, options = {}) {
      const product = getProduct(slug);
      const size =
        options.size ||
        product?.sizes?.[0] ||
        'One size';
      const metal =
        options.metal ||
        product?.colorLabel ||
        product?.metal?.[0] ||
        'Sterling Silver';
      const qty = Math.max(1, Number(options.qty) || 1);
      const image =
        productImageSrc(product) ||
        options.image ||
        '';
      const name = product?.name || options.name || slug;
      const price =
        Number(product?.price) ||
        Number(options.price) ||
        0;
      const customEntries = Array.isArray(options.customization)
        ? options.customization
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
      return {
        id: `${slug}-${size}-${metal}${customKey ? `-${customKey}` : ''}`,
        slug,
        size,
        metal,
        qty,
        image,
        name,
        price,
        sku: product?.sku || options.sku || '',
        colorLabel: product?.colorLabel || options.colorLabel || '',
        customization: customEntries,
        customKey,
      };
    }

    function mergeCartLines(current, lines) {
      let next = current;
      for (const line of lines) {
        const existing = next.find(
          (item) =>
            item.slug === line.slug &&
            item.size === line.size &&
            item.metal === line.metal &&
            (item.customKey || '') === (line.customKey || ''),
        );
        if (existing) {
          next = next.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  qty: item.qty + line.qty,
                  image: line.image || item.image,
                  name: line.name || item.name,
                  price: line.price || item.price,
                  customization: item.customization?.length
                    ? item.customization
                    : line.customization,
                }
              : item,
          );
        } else {
          next = [...next, line];
        }
      }
      return next;
    }

    function addToCart(slug, options = {}) {
      const line = buildCartLine(slug, options);
      setCart((current) => mergeCartLines(current, [line]));
      setCartOpen(true);
      setQuickViewSlug(null);
    }

    /** Add several lines in one cart update (sets / bundles). */
    function addItemsToCart(entries = []) {
      const lines = (entries || [])
        .filter((e) => e?.slug)
        .map((e) => buildCartLine(e.slug, e));
      if (!lines.length) return;
      setCart((current) => mergeCartLines(current, lines));
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
      setPromo(null);
      setPromoError('');
    }

    async function applyPromoCode(code, email) {
      setPromoBusy(true);
      setPromoError('');
      try {
        const items = cart.map((item) => {
          const product = getProduct(item.slug);
          return {
            slug: item.slug,
            qty: item.qty,
            price: product?.price ?? item.price ?? 0,
            category: product?.category || '',
            collection: product?.collection || '',
          };
        });
        const res = await fetch('/api/discounts/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            items,
            email: email || user?.email || '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          setPromo(null);
          setPromoError(data.error || 'Could not apply this code.');
          return { ok: false, error: data.error || 'Could not apply this code.' };
        }
        setPromo({
          code: data.code,
          discountId: data.discountId,
          discountAmount: data.discountAmount,
          label: data.label,
          name: data.name,
        });
        return { ok: true, ...data };
      } catch (err) {
        setPromo(null);
        const msg = err.message || 'Could not apply this code.';
        setPromoError(msg);
        return { ok: false, error: msg };
      } finally {
        setPromoBusy(false);
      }
    }

    function clearPromo() {
      setPromo(null);
      setPromoError('');
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
          sku: item.sku || product?.sku || '',
          colorLabel: item.colorLabel || product?.colorLabel || '',
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
          discountCode: order.discountCode || promo?.code || '',
        });
        const next = data.order;
        setOrders((current) => [next, ...current.filter((o) => o.id !== next.id)]);
        clearCart();
        return next;
      } catch (err) {
        if (err.status === 401) {
          const authErr = new Error('Please sign in again to complete your order.');
          authErr.status = 401;
          throw authErr;
        }
        throw err;
      }
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
      cartPayable,
      discountAmount,
      promo,
      promoError,
      promoBusy,
      applyPromoCode,
      clearPromo,
      addToCart,
      addItemsToCart,
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
    promo,
    promoError,
    promoBusy,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
