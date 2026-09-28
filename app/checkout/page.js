'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [error, setError] = useState('');

  function onSubmit(event) {
    event.preventDefault();
    if (!cart.length) {
      setError('Your bag is empty.');
      return;
    }
    const id = `VS${Date.now().toString().slice(-8)}`;
    sessionStorage.setItem(
      'vs-order',
      JSON.stringify({
        id,
        total: cartTotal,
        items: cart,
      })
    );
    clearCart();
    router.push('/order-confirmation');
  }

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:grid-cols-12 md:px-10">
        <form onSubmit={onSubmit} className="space-y-8 md:col-span-7">
          <h1 className="font-display text-5xl">Checkout</h1>
          <section>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Client</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Input label="First name" required />
              <Input label="Last name" required />
              <div className="sm:col-span-2">
                <Input label="Email" type="email" required />
              </div>
              <div className="sm:col-span-2">
                <Input label="Telephone" type="tel" required />
              </div>
            </div>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Destination</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Address" required />
              </div>
              <Input label="City" required />
              <Input label="Postal code" required />
              <div className="sm:col-span-2">
                <Input label="Country" required />
              </div>
            </div>
          </section>
          <section>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Payment</p>
            <p className="mt-3 text-sm text-stone">A private preview. No charge will be taken — this confirms the order with the house.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Name on card" required />
              </div>
              <div className="sm:col-span-2">
                <Input label="Card number" placeholder="•••• •••• •••• ••••" required />
              </div>
              <Input label="Expiry" placeholder="MM / YY" required />
              <Input label="CVC" placeholder="•••" required />
            </div>
          </section>
          {error && <p className="text-sm text-gold">{error}</p>}
          <button type="submit" className="h-12 bg-ink px-10 text-[11px] tracking-[0.28em] text-ivory uppercase">
            Place order · {money(cartTotal)}
          </button>
        </form>

        <aside className="md:col-span-5">
          <div className="sticky top-32 border border-cream p-8">
            <p className="text-[11px] tracking-[0.28em] uppercase">Order</p>
            <ul className="mt-6 space-y-4">
              {cart.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                return (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {product.name} × {item.qty}
                    </span>
                    <span>{money(product.price * item.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex justify-between border-t border-cream pt-6">
              <span>Total</span>
              <span className="font-display text-2xl">{money(cartTotal)}</span>
            </div>
            <p className="mt-4 text-xs text-stone">Complimentary insured shipping. Duties may apply.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, type = 'text', required, placeholder }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.28em] uppercase">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border-b border-cream bg-transparent py-3 outline-none placeholder:text-stone/40"
      />
    </label>
  );
}
