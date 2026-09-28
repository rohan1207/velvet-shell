function Legal({ title, children }) {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-2xl px-5">
        <h1 className="font-display text-5xl md:text-6xl">{title}</h1>
        <div className="mt-10 space-y-5 text-base leading-relaxed text-stone">{children}</div>
      </div>
    </div>
  );
}

export default Legal;
