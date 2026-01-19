export function About() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl lg:text-6xl tracking-tighter mb-6">
            About CASAKA7LA
          </h2>
          <div className="w-16 h-0.5 bg-black mx-auto mb-8"></div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h3 className="text-3xl tracking-tighter mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-gray-700 tracking-wide leading-relaxed">
              <p>
                Founded with a vision to redefine contemporary streetwear, CASAKA7LA emerged from the intersection of high fashion and urban culture. We believe that clothing should be more than just fabric—it's a statement, an attitude, a way of life.
              </p>
              <p>
                Our design philosophy centers on minimalist luxury, where every piece is carefully crafted to balance bold aesthetics with timeless elegance. We draw inspiration from the raw energy of street culture and the refined sophistication of high fashion houses.
              </p>
              <p>
                Each collection tells a story, featuring premium materials, meticulous attention to detail, and innovative designs that push the boundaries of modern fashion.
              </p>
            </div>
          </div>

          <div className="bg-black aspect-square"></div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          <div className="text-center">
            <div className="w-12 h-12 bg-black mx-auto mb-6"></div>
            <h4 className="text-xl tracking-tighter mb-4">
              Quality First
            </h4>
            <p className="text-gray-600 tracking-wide text-sm">
              Premium materials and expert craftsmanship in every piece we create
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-black mx-auto mb-6"></div>
            <h4 className="text-xl tracking-tighter mb-4">
              Sustainable Design
            </h4>
            <p className="text-gray-600 tracking-wide text-sm">
              Committed to ethical production and environmental responsibility
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-black mx-auto mb-6"></div>
            <h4 className="text-xl tracking-tighter mb-4">
              Limited Editions
            </h4>
            <p className="text-gray-600 tracking-wide text-sm">
              Exclusive drops that celebrate individuality and authentic style
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-black text-white p-12 lg:p-16">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl lg:text-4xl tracking-tighter mb-6">
              Our Mission
            </h3>
            <p className="text-gray-300 tracking-wide text-lg leading-relaxed">
              To create a global community of individuals who dare to express themselves through fashion. We're not just selling clothes—we're building a movement that celebrates authenticity, creativity, and the courage to stand out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
