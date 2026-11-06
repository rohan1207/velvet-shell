function Legal({ title, children }) {
  return (
    <div className="bg-ivory pt-page pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-8 md:pt-12">
        <h1 className="font-display text-5xl leading-[1.08] md:text-6xl">{title}</h1>
        <div className="mt-10 space-y-5 text-base leading-relaxed text-stone">{children}</div>
      </div>
    </div>
  );
}

export default Legal;
