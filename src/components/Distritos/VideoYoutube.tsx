'use client';

// Embedded YouTube video.
// The previous site used react-player for this; it was a dependency of
// almost a megabyte to show an iframe. Here the embed URL is built
// from the short link the page stores.
function idDeYoutube(url: string): string | null {
  const corto = url.match(/youtu\.be\/([\w-]+)/);
  if (corto) return corto[1];
  const largo = url.match(/[?&]v=([\w-]+)/);
  if (largo) return largo[1];
  const incrustado = url.match(/embed\/([\w-]+)/);
  return incrustado ? incrustado[1] : null;
}

export default function VideoYoutube({ url, titulo }: { url: string; titulo: string }) {
  const id = idDeYoutube(url);
  if (!id) return null;

  return (
    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
      <iframe
        title={titulo}
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
