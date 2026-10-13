import {
  DIMENSIONES,
  RESPUESTAS,
  type DatosNegocio,
  type Respuesta,
  type Respuestas,
} from '../../lib/barometro';

interface Props {
  negocio: DatosNegocio;
  respuestas: Respuestas;
  alCambiarNegocio: (cambios: Partial<DatosNegocio>) => void;
  alResponder: (dimension: number, indicador: number, respuesta: Respuesta) => void;
}

const CAMPOS_NEGOCIO: Array<{
  clave: keyof DatosNegocio;
  rotulo: string;
  ejemplo: string;
}> = [
  { clave: 'nombre', rotulo: 'Nombre del negocio', ejemplo: 'Ej.: Finca Los Cafetales' },
  {
    clave: 'actividad',
    rotulo: 'Actividad turística',
    ejemplo: 'Ej.: hospedaje rural, tour operador',
  },
  { clave: 'ubicacion', rotulo: 'Ubicación', ejemplo: 'Cantón / provincia / país' },
];

export default function Instrumento({ negocio, respuestas, alCambiarNegocio, alResponder }: Props) {
  return (
    <>
      <section className="rt_baro_tarjeta">
        <h2>Datos del emprendimiento</h2>
        <div className="rt_baro_campos">
          {CAMPOS_NEGOCIO.map(({ clave, rotulo, ejemplo }) => (
            <div className="rt_baro_campo" key={clave}>
              <label htmlFor={`baro-${clave}`}>{rotulo}</label>
              <input
                id={`baro-${clave}`}
                type="text"
                value={negocio[clave]}
                placeholder={ejemplo}
                onChange={(evento) => alCambiarNegocio({ [clave]: evento.target.value })}
              />
            </div>
          ))}
        </div>
        <p className="rt_baro_nota">
          Seleccione una respuesta por indicador. “No aplica” queda fuera del cálculo, pero debe
          justificarse posteriormente durante la verificación.
        </p>
      </section>

      <section className="rt_baro_tarjeta">
        <h2>Indicadores</h2>
        {DIMENSIONES.map((dimension, d) => (
          <div key={dimension.nombre}>
            <h3>{dimension.nombre}</h3>
            {dimension.indicadores.map((indicador, i) => (
              <fieldset className="rt_baro_indicador" key={indicador}>
                <legend>
                  {i + 1}. {indicador}
                </legend>
                <div className="rt_baro_opciones">
                  {RESPUESTAS.map((opcion) => (
                    <label className="rt_baro_opcion" key={opcion}>
                      <input
                        type="radio"
                        name={`d${d}q${i}`}
                        value={opcion}
                        checked={respuestas[d][i] === opcion}
                        onChange={() => alResponder(d, i, opcion)}
                      />
                      {opcion}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
