'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// /final/countdown/9/mayo — the launch countdown.
// It is kept because it is part of the project's history: on May 9,
// 2022 at 2:50 p.m. the site was presented. The date has already
// passed, so today it always shows the welcome screen.
// Three fixes compared to the original:
//  - `setInterval` was called without an interval and inside a
//    useEffect without a dependency array, so it started a new timer
//    on every render and none were cleared. The tab ended up with
//    hundreds of timers running at once.
//  - `clearInterval(interval.current)` never cleared anything, because
//    `interval` was a number, not a ref.
//  - The confetti came from react-confetti; here it is CSS, with no
//    dependency.

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
  // Starts as null so the server and the browser paint the same thing;
  // the clock only exists on the browser side.
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
