import { ArrowRight } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-tight">
            Join Our Community
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Be the first to discover new collections, exclusive releases, and insider access
            to our creative process.
          </p>

          <form className="max-w-xl mx-auto mt-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-white/30 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 text-sm tracking-wider uppercase hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-xs text-white/50 mt-4 text-left">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
