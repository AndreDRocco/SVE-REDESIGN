'use client';

export default function Footer() {
  return (
    <footer className="border-t border-mist/10 bg-forest-deep px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-mist">Serra Verde Express</p>
          <p className="mt-3 max-w-xs text-sm text-mist-dim">
            Passeio de trem turístico entre Curitiba e Morretes, pela Serra do Mar.
          </p>
        </div>

        <div className="text-sm text-mist-dim">
          <p className="mb-3 font-semibold text-mist">Contato</p>
          <p>
            <a href="mailto:contato@serraverdeexpress.com.br" data-cursor="hover" className="hover:text-sunset-light">
              contato@serraverdeexpress.com.br
            </a>
          </p>
          <p className="mt-1">(41) 3888-3488</p>
        </div>

        <form
          className="text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            // Placeholder: sem backend de newsletter ligado ainda — ver README.
          }}
        >
          <label htmlFor="newsletter-email" className="mb-3 block font-semibold text-mist">
            Clube de vantagens
          </label>
          <div className="flex overflow-hidden rounded-full border border-mist/30">
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Seu e-mail"
              className="w-full bg-transparent px-4 py-2 text-mist placeholder:text-mist-dim focus:outline-none"
            />
            <button
              type="submit"
              data-cursor="hover"
              className="whitespace-nowrap bg-moss px-4 py-2 text-forest-deep transition-colors hover:bg-gold"
            >
              Assinar
            </button>
          </div>
        </form>
      </div>

      <p className="mx-auto mt-16 max-w-6xl text-xs text-mist-dim/70">
        © {new Date().getFullYear()} Serra Verde Express. Protótipo de redesign — dados de pacotes e preços refletem
        o site em produção no momento da captura e precisam ser conectados à fonte real antes do lançamento.
      </p>
    </footer>
  );
}
