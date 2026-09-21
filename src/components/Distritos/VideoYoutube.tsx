'use client';

// Video de YouTube incrustado.
// El sitio anterior usaba react-player para esto; era una dependencia
// de casi un megabyte para mostrar un iframe. Aquí se arma la URL de
// incrustación a partir del enlace corto que guarda la ficha.
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
