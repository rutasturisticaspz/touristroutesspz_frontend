import {
  AVISO_IMPORTANTE_TEXTO,
  AVISO_IMPORTANTE_TITULO,
  nivelDe,
  notaBaseDeCalculo,
  resumenDe,
  tonoDe,
  type Resultado,
} from '../../lib/barometro';
import RadarSvg from './RadarSvg';

const GRADOS_POR_PORCENTAJE = 3.6;

interface Props {
  resultado: Resultado;
  generandoPdf: boolean;
  errorPdf: boolean;
  alDescargar: () => void;
  alLimpiar: () => void;
}

export default function Resultados({ resultado, generandoPdf, errorPdf, alDescargar, alLimpiar }: Props) {
  const { porcentaje, dimensiones } = resultado;
  const calculado = porcentaje !== null;
  const nivel = calculado ? nivelDe(porcentaje) : null;

  return (
    <section className="rt_baro_tarjeta" aria-live="polite">
      <h2>Resultados del diagnóstico</h2>

      <div className="rt_baro_tablero">
        <div className="rt_baro_puntaje">
          <div
            className="rt_baro_anillo"
            data-tono={calculado ? tonoDe(porcentaje) : undefined}
            style={{ ['--grados' as string]: `${(porcentaje ?? 0) * GRADOS_POR_PORCENTAJE}deg` }}
          >
            <div>
              <div className="rt_baro_porcentaje">{calculado ? `${porcentaje}%` : '—'}</div>
              <div className="rt_baro_nivel">{nivel ?? 'Sin calcular'}</div>
            </div>
          </div>
          <p className="rt_baro_resumen">{resumenDe(porcentaje)}</p>
          {calculado && <p className="rt_baro_nota">{notaBaseDeCalculo(resultado)}</p>}
        </div>

        <RadarSvg dimensiones={dimensiones} />
      </div>

      <h3>Resultados por dimensión</h3>
      <div className="rt_baro_tabla">
        <table>
          <thead>
            <tr>
              <th>Dimensión</th>
              <th>Indicadores válidos</th>
              <th>Puntaje</th>
              <th>Lectura</th>
            </tr>
          </thead>
          <tbody>
            {dimensiones.map((dimension) => (
              <tr key={dimension.nombre}>
                <td>{dimension.nombre}</td>
                <td>{dimension.validos}</td>
                <td>{dimension.porcentaje === null ? 'Sin datos' : `${dimension.porcentaje}%`}</td>
                <td>
                  {dimension.porcentaje === null ? (
                    '—'
                  ) : (
                    <span className="rt_baro_etiqueta">{nivelDe(dimension.porcentaje)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rt_baro_acciones">
        <button
          type="button"
          className="rt_baro_boton"
          onClick={alDescargar}
          disabled={generandoPdf}
        >
          {generandoPdf ? 'Generando PDF…' : 'Descargar resultados (PDF)'}
        </button>
        <button type="button" className="rt_baro_boton rt_baro_boton_secundario" onClick={alLimpiar}>
          Limpiar respuestas
        </button>
      </div>

      {errorPdf && (
        <p className="rt_baro_nota" role="alert">
          No se pudo generar el PDF. Intente de nuevo.
        </p>
      )}

      <div className="rt_baro_aviso">
        <strong>{AVISO_IMPORTANTE_TITULO}</strong>
        {AVISO_IMPORTANTE_TEXTO}
      </div>
    </section>
  );
}
