import Link from 'next/link';
import { Globe, Route, MessageCircle, ArrowRight, Mail } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const pillars = [
  {
    title: 'Exploración 3D',
    description:
      'Un globo interactivo en tres dimensiones que permite descubrir los puntos de interés de Sucre de forma visual e intuitiva, como nunca antes se había visto.',
    icon: Globe,
  },
  {
    title: 'Rutas Inteligentes',
    description:
      'Inteligencia artificial que genera itinerarios personalizados según tus gustos, tiempo y presupuesto, optimizando cada paso de tu visita.',
    icon: Route,
  },
  {
    title: 'Asistencia Virtual',
    description:
      'Un guía disponible las 24 horas que responde tus preguntas sobre la ciudad, recomienda lugares y te acompaña durante todo tu recorrido.',
    icon: MessageCircle,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AcercaDePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ------------------------------------------------------------ */}
      {/*  Navbar                                                       */}
      {/* ------------------------------------------------------------ */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#c2410c]"
          >
            SmartTour
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/" className="transition-colors hover:text-[#c2410c]">
              Inicio
            </Link>
            <Link href="/rutas" className="transition-colors hover:text-[#c2410c]">
              Rutas
            </Link>
            <Link href="/acerca-de" className="text-[#c2410c]">
              Acerca de
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------ */}
      {/*  Hero Section                                                 */}
      {/* ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#f97316] px-6 py-24 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            Tecnología &amp; Turismo
          </span>

          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Sobre SmartTour
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-white/85">
            Nacimos con la visión de promover el turismo en Sucre utilizando
            tecnología digital de vanguardia. Queremos que cada visitante
            descubra la riqueza cultural, histórica y natural de esta ciudad
            Patrimonio de la Humanidad de una forma interactiva, educativa y
            completamente inolvidable.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  Nuestra Misión — 2 columnas                                  */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Texto */}
          <div>
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-wider text-[#c2410c]">
              Nuestra Misión
            </span>
            <h2 className="mb-6 text-3xl font-black text-slate-900">
              Guiar, enseñar y facilitar la exploración
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Sucre es una ciudad con siglos de historia, pero su riqueza
                muchas veces pasa desapercibida para el visitante promedio.
                Nuestra misión es cerrar esa brecha.
              </p>
              <p>
                A través de herramientas de inteligencia artificial,
                visualización 3D e información curada, buscamos que cada
                turista — sin importar de dónde venga — pueda disfrutar de
                una experiencia auténtica, personalizada y profunda.
              </p>
              <p>
                No somos solo una app de rutas. Somos un proyecto que conecta
                personas con cultura, historia y comunidad.
              </p>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 to-amber-50 shadow-lg">
              <img
                src="/images/places/sucre.jpg"
                alt="Ciudad de Sucre"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-[#ea580c]/10" />
            <div className="absolute -left-4 -top-4 h-16 w-16 rounded-xl bg-[#ea580c]/5" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  Pilares — Grid de 3                                          */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-wider text-[#c2410c]">
              Tecnología
            </span>
            <h2 className="mb-3 text-3xl font-black text-slate-900">
              Los Pilares de SmartTour
            </h2>
            <p className="mx-auto max-w-xl text-slate-500">
              Tres pilares tecnológicos que hacen posible una experiencia
              turística sin precedentes en Sucre.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="group rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c2410c]/10 text-[#c2410c] transition-colors group-hover:bg-[#c2410c] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  CTA / Contacto                                               */}
      {/* ------------------------------------------------------------ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-[#c2410c] to-[#ea580c] px-8 py-14 text-center text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-black">¿Querés saber más?</h2>
          <p className="mb-8 text-white/85">
            Estamos abiertos a colaboraciones, sugerencias y cualquier idea
            que nos ayude a mejorar la experiencia turística de Sucre.
          </p>

          <a
            href="mailto:Datenmeister@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#c2410c] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Mail className="h-4 w-4" />
            Datenmeister@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} SmartTour — Ciudad Patrimonio de
        la Humanidad
      </footer>
    </main>
  );
}
