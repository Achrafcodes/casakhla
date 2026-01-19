export function Testimonials() {
  const quotes = [
    {
      text: '"A masterclass in contemporary minimalism. Every piece is a work of art."',
      author: 'Vogue Magazine',
    },
    {
      text: '"Redefining luxury for the modern era with impeccable attention to detail."',
      author: 'GQ Style',
    },
    {
      text: '"Bold, unapologetic, and utterly timeless. The future of fashion is here."',
      author: 'Highsnobiety',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="text-gray-500 uppercase tracking-[0.3em] mb-4 text-xs">
            Press
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter">
            What They Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {quotes.map((quote, index) => (
            <div key={index} className="text-center space-y-6">
              <div className="text-6xl text-gray-300 leading-none">"</div>
              <p className="text-xl md:text-2xl leading-relaxed tracking-tight">
                {quote.text}
              </p>
              <div className="text-sm uppercase tracking-wider text-gray-600">
                — {quote.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
