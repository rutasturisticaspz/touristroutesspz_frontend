'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// /final/countdown/9/mayo — la cuenta regresiva del lanzamiento.
// Se conserva porque es parte de la historia del proyecto: el 9 de
// mayo de 2022 a las 2:50 p.m. se presentó el sitio. La fecha ya pasó,
// así que hoy siempre muestra la pantalla de bienvenida.
// Tres arreglos respecto al original:
//  - `setInterval` se llamaba sin intervalo y dentro de un useEffect
//    sin arreglo de dependencias, así que arrancaba un temporizador
//    nuevo en cada render y ninguno se limpiaba. La pestaña terminaba
//    con cientos de temporizadores corriendo a la vez.
//  - `clearInterval(interval.current)` nunca limpiaba nada, porque
//    `interval` era un número, no una referencia.
//  - El confeti venía de react-confetti; aquí es CSS, sin dependencia.

const FECHA_LANZAMIENTO = new Date('2022-05-09T14:50:00-06:00').getTime();

interface Restante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcular(): Restante {
  const distancia = FECHA_LANZAMIENTO - Date.now();
  if (distancia <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  return {
    dias: Math.floor(distancia / 86400000),
    horas: Math.floor((distancia % 86400000) / 3600000),
    minutos: Math.floor((distancia % 3600000) / 60000),
    segundos: Math.floor((distancia % 60000) / 1000),
  };
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');

export default function Pagina() {
  // Arranca en null para que el servidor y el navegador pinten lo
  // mismo; el reloj sólo existe del lado del navegador.
  const [restante, setRestante] = useState<Restante | null>(null);

  useEffect(() => {
    setRestante(calcular());
    const temporizador = setInterval(() => setRestante(calcular()), 1000);
    return () => clearInterval(temporizador);
  }, []);

  const termino =
    restante !== null &&
    restante.dias === 0 &&
    restante.horas === 0 &&
    restante.minutos === 0 &&
    restante.segundos === 0;

  return (
    <div className="FinalCountdown">
      <section
        className="timer-container"
        style={{
          background:
            'linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(/img/home/Chirripo1.jpg) center center/cover no-repeat',
        }}
      >
        <section className="timer">
          {termino ? (
            <>
              <div className="rt_confeti" aria-hidden="true">
                {Array.from({ length: 60 }, (_, indice) => (
                  <span
                    key={indice}
                    style={{
                      left: `${(indice * 100) / 60}%`,
                      animationDelay: `${(indice % 12) * 0.35}s`,
                      animationDuration: `${4 + (indice % 5)}s`,
                      background: ['#f94144', '#f9c74f', '#90be6d', '#577590', '#f3722c'][indice % 5],
                    }}
                  />
                ))}
              </div>
              <div className="title_clock">
                <span>¡BIENVENIDOS!</span>
              </div>
              <div className="final_countdown_ready">
                <h2>La espera ha terminado, es momento de conocer</h2>
                <h2 id="quehacerenperez_title">QUÉ HACER EN PÉREZ</h2>
                <Link href="/">
                  <button type="button">COMENZAR</button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="title_clock">
                <span>¿Qué hacer en Pérez?</span>
              </div>
              <div className="clock">
                <section>
                  <p>{dosDigitos(restante?.dias ?? 0)}</p>
                  <small>Días</small>
                </section>
                <span>:</span>
                <section>
                  <p>{dosDigitos(restante?.horas ?? 0)}</p>
                  <small>Horas</small>
                </section>
                <span>:</span>
                <section>
                  <p>{dosDigitos(restante?.minutos ?? 0)}</p>
                  <small>Minutos</small>
                </section>
                <span>:</span>
                <section>
                  <p>{dosDigitos(restante?.segundos ?? 0)}</p>
                  <small>Segundos</small>
                </section>
              </div>
            </>
          )}

          <div className="logos_clock">
            <img src="/img/logort1.1.png" alt="logo" />
          </div>
        </section>
      </section>

      <style>{`
        .rt_confeti {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .rt_confeti span {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 16px;
          opacity: .9;
          animation-name: rt_caer;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes rt_caer {
          0%   { transform: translateY(-20px) rotate(0deg); }
          100% { transform: translateY(105vh) rotate(720deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rt_confeti { display: none; }
        }
      `}</style>
    </div>
  );
}
