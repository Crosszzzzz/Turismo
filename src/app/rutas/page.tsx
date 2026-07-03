import Link from 'next/link';
import { MapPin, Clock, Star, ArrowRight, ChevronLeft } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const topPlaces = [
  {
    id: 1,
    name: 'Parque Cretácico',
    description:
      'El parque de dinosaurios más importante de Bolivia. Más de 5000 huellas fósiles en sitios originales.',
    image: '/images/places/parke%20cretacico.jpeg',
    rating: 4.8,
    badge: 'Top Elección',
  },
  {
    id: 2,
    name: 'Casa de la Libertad',
    description:
      'Declarada Patrimonio Cultural de Bolivia. Aquí se firmó la independencia en 1825.',
    image: '/images/places/casa%20de%20la%20libertad.jpeg',
    rating: 4.7,
    badge: 'Top Elección',
  },
  {
    id: 3,
    name: 'Castillo de la Glorieta',
    description:
      'Fascinante castillo de estilo ecléctico en las afueras de la ciudad, con historia y arquitectura única.',
    image: '/images/places/casa%20de%20la%20glorieta.jpeg',
    rating: 4.6,
    badge: 'Top Elección',
  },
];

const recommendedRoutes = [
  {
    id: 1,
    title: 'Ruta Histórica Colonial',
    duration: '2 horas',
    stops: 6,
    description:
      'Recorre las iglesias, plazas y edificios coloniales que hacen de Sucre una joya arquitectónica.',
    highlights: ['Catedral Metropolitana', 'Casa de la Libertad', 'Iglesia de San Francisco'],
  },
  {
    id: 2,
    title: 'Ruta de Museos',
    duration: 'Medio día',
    stops: 5,
    description:
      'Descubre la riqueza cultural de Sucre a través de sus museos: arte textil, arte sacro y teatro.',
    highlights: ['Museo ASUR', 'Museo del Tesoro', 'Teatro Gran Mariscal'],
  },
  {
    id: 3,
    title: 'Ruta Gastronómica',
    duration: '3 horas',
    stops: 4,
    description:
      'Saborea la cocina cruceña y chaqueña en los mejores mercados y restaurantes de la ciudad.',
    highlights: ['Mercado Central', 'Restaurante La Taverna', 'Heladería Kokko'],
  },
];

const reviews = [
  {
    id: 1,
    name: 'Ana García',
    origin: 'Buenos Aires, Argentina',
    text: 'La ruta histórica fue increíble. Los guías locales son muy amables y Sucre tiene una belleza que no esperaba. ¡Totalmente recomendada!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marco Ponce',
    origin: 'Lima, Perú',
    text: 'El Parque Cretácico es imperdible. Mis hijos estuvieron fascinados con las huellas de dinosaurios. Una experiencia única en Sudamérica.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lucía Fernández',
    origin: 'Madrid, España',
    text: 'La ruta gastronómica me abrió los ojos a una cocina que desconocía total. El mercado central es una joya escondida.',
    rating: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function RutasPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ------------------------------------------------------------ */}
      {/*  Navbar (simplified for this page)                            */}
      {/* ------------------------------------------------------------ */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#c2410c]"
          >
            SmartTour
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/" className="transition-colors hover:text-[#c2410c]">
              Inicio
            </Link>
            <Link href="/rutas" className="text-[#c2410c]">
              Rutas
            </Link>
            <Link href="/acerca-de" className="transition-colors hover:text-[#c2410c]">
              Acerca de
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------ */}
      {/*  Hero Section                                                 */}
      {/* ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#f97316] px-6 py-24 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            Ciudad Patrimonio de la Humanidad
          </span>

          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Explora Sucre a tu Ritmo
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/85">
            Rutas prearmadas para descubrir la historia, la cultura y los sabores de una
            de las ciudades más antiguas de Sudamérica.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#c2410c] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <MapPin className="h-4 w-4" />
            Creá tu ruta personalizada
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  Section 1 — Lugares Más Visitados                            */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-black text-slate-900">Lugares Más Visitados</h2>
          <p className="text-slate-500">
            Los destinos favoritos de los viajeros que visitan Sucre.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {topPlaces.map((place) => (
            <article
              key={place.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image placeholder */}
              <div className="relative h-52 overflow-hidden bg-slate-200">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badge */}
                <span className="absolute left-3 top-3 rounded-full bg-[#c2410c] px-3 py-1 text-xs font-bold text-white shadow-md">
                  {place.badge}
                </span>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{place.name}</h3>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {place.rating}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">{place.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  Section 2 — Rutas Recomendadas                               */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-black text-slate-900">Rutas Recomendadas</h2>
            <p className="text-slate-500">
              Itinerarios pensados para que aproveches al máximo tu visita.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {recommendedRoutes.map((route) => (
              <article
                key={route.id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Duration badge */}
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#c2410c]">
                  <Clock className="h-4 w-4" />
                  {route.duration}
                  <span className="ml-auto rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {route.stops} paradas
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">{route.title}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-500">
                  {route.description}
                </p>

                {/* Highlights */}
                <ul className="mb-6 space-y-1.5">
                  {route.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-3 w-3 shrink-0 text-[#ea580c]" />
                      {h}
                    </li>
                  ))}
                </ul>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c2410c] py-3 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]">
                  Ver detalles
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  Section 3 — Reseñas de Viajeros                               */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-black text-slate-900">Reseñas de Viajeros</h2>
          <p className="text-slate-500">Lo que dicen quienes ya visitaron Sucre.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <p className="mb-5 text-sm leading-relaxed text-slate-600">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-slate-900">{review.name}</p>
                <p className="text-xs text-slate-400">{review.origin}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  CTA Footer                                                   */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-gradient-to-r from-[#c2410c] to-[#ea580c] px-6 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-black">¿Listo para descubrir Sucre?</h2>
        <p className="mb-8 text-white/80">
          Creá tu ruta personalizada con la ayuda de nuestra guía virtual.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#c2410c] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Volver al mapa
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Simple footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} SmartTour — Ciudad Patrimonio de la Humanidad
      </footer>
    </main>
  );
}
