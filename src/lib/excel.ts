// .xlsx file generator, with no dependencies.
// The previous panel used SheetJS (`xlsx`) only for this screen. That
// npm version carries open security advisories and the project stopped
// being published there, so bringing it back would have meant
// inheriting the same problem we are cleaning up.
// It turns out an .xlsx is a ZIP with a few XML files inside. Here it
// is built by hand: the ZIP is written uncompressed ("stored" method,
// which the format allows) and the cells go as inline text, so the
// shared strings table is not needed. Excel, LibreOffice and Numbers
// open it the same.
// Scope on purpose: text and number values, a bold header row and
// automatic column width. No formulas, colors or charts, which is
// exactly what the previous export did.

export type Celda = string | number | null | undefined;

export interface Hoja {
  // Sheet tab name. Excel does not allow : \ / ? * [ ] or more than 31
  // characters.
  nombre: string;
  // First row: headers. The rest, data.
  filas: Celda[][];
}

// ------------------------------------------------------------
//  XML
// ------------------------------------------------------------

// Control characters that XML 1.0 does not allow inside text.
// If one slips in —and in the database there are descriptions pasted
// from Word that carry some—, Excel says the file is damaged.
const CONTROL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]', 'g');

// Escapes what XML does not allow and removes control characters.
function escapar(texto: string): string {
  return texto
    .replace(CONTROL, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 0 -> A, 25 -> Z, 26 -> AA...
function columna(indice: number): string {
  let n = indice + 1;
  let nombre = '';
  while (n > 0) {
    const resto = (n - 1) % 26;
    nombre = String.fromCharCode(65 + resto) + nombre;
    n = Math.floor((n - 1) / 26);
  }
  return nombre;
}

// Sheet tab name that Excel accepts.
function nombreDeHoja(nombre: string, indice: number): string {
  const limpio = nombre.replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31);
  return limpio || `Hoja${indice + 1}`;
}

function celdaXml(valor: Celda, referencia: string, encabezado: boolean): string {
  const estilo = encabezado ? ' s="1"' : '';

  if (valor === null || valor === undefined || valor === '') {
    return `<c r="${referencia}"${estilo}/>`;
  }

  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return `<c r="${referencia}"${estilo}><v>${valor}</v></c>`;
  }

  return `<c r="${referencia}"${estilo} t="inlineStr"><is><t xml:space="preserve">${escapar(
    String(valor),
  )}</t></is></c>`;
}

function hojaXml(hoja: Hoja): string {
  // Approximate column width, based on the longest content.
  const anchos: number[] = [];
  for (const fila of hoja.filas) {
    fila.forEach((valor, indice) => {
      const largo = valor === null || valor === undefined ? 0 : String(valor).length;
      anchos[indice] = Math.min(60, Math.max(anchos[indice] ?? 10, largo + 2));
    });
  }

  const columnas = anchos
    .map(
      (ancho, indice) =>
        `<col min="${indice + 1}" max="${indice + 1}" width="${ancho}" customWidth="1"/>`,
    )
    .join('');

  const filas = hoja.filas
    .map((fila, indiceFila) => {
      const numero = indiceFila + 1;
      const celdas = fila
        .map((valor, indiceColumna) =>
          celdaXml(valor, `${columna(indiceColumna)}${numero}`, indiceFila === 0),
        )
        .join('');
      return `<row r="${numero}">${celdas}</row>`;
    })
    .join('');

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    (columnas ? `<cols>${columnas}</cols>` : '') +
    `<sheetData>${filas}</sheetData>` +
    `</worksheet>`
  );
}

// ------------------------------------------------------------
//  ZIP
// ------------------------------------------------------------

// CRC-32 table, the one the ZIP format requires.
const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let valor = i;
    for (let j = 0; j < 8; j++) {
      valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1;
    }
    tabla[i] = valor >>> 0;
  }
  return tabla;
})();

function crc32(datos: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < datos.length; i++) {
    crc = TABLA_CRC[(crc ^ datos[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface Entrada {
  nombre: string;
  datos: Uint8Array;
}

// Date and time in the MS-DOS format that ZIP stores.
function fechaDos(fecha: Date): { fecha: number; hora: number } {
  return {
    fecha:
      (((fecha.getFullYear() - 1980) & 0x7f) << 9) |
      ((fecha.getMonth() + 1) << 5) |
      fecha.getDate(),
    hora:
      (fecha.getHours() << 11) | (fecha.getMinutes() << 5) | Math.floor(fecha.getSeconds() / 2),
  };
}

// Uncompressed ZIP. Enough: these files are small.
function armarZip(entradas: Entrada[], momento: Date): Uint8Array {
  const codificador = new TextEncoder();
  const { fecha, hora } = fechaDos(momento);

  const locales: Uint8Array[] = [];
  const centrales: Uint8Array[] = [];
  let desplazamiento = 0;

  for (const entrada of entradas) {
    const nombre = codificador.encode(entrada.nombre);
    const suma = crc32(entrada.datos);
    const tamano = entrada.datos.length;

    const cabecera = new Uint8Array(30 + nombre.length);
    const vista = new DataView(cabecera.buffer);
    vista.setUint32(0, 0x04034b50, true); // signature
    vista.setUint16(4, 20, true); // version needed to extract
    vista.setUint16(6, 0x0800, true); // UTF-8 file names
    vista.setUint16(8, 0, true); // method: stored (uncompressed)
    vista.setUint16(10, hora, true);
    vista.setUint16(12, fecha, true);
    vista.setUint32(14, suma, true);
    vista.setUint32(18, tamano, true);
    vista.setUint32(22, tamano, true);
    vista.setUint16(26, nombre.length, true);
    vista.setUint16(28, 0, true);
    cabecera.set(nombre, 30);

    locales.push(cabecera, entrada.datos);

    const central = new Uint8Array(46 + nombre.length);
    const vistaCentral = new DataView(central.buffer);
    vistaCentral.setUint32(0, 0x02014b50, true);
    vistaCentral.setUint16(4, 20, true); // version made by
    vistaCentral.setUint16(6, 20, true);
    vistaCentral.setUint16(8, 0x0800, true);
    vistaCentral.setUint16(10, 0, true);
    vistaCentral.setUint16(12, hora, true);
    vistaCentral.setUint16(14, fecha, true);
    vistaCentral.setUint32(16, suma, true);
    vistaCentral.setUint32(20, tamano, true);
    vistaCentral.setUint32(24, tamano, true);
    vistaCentral.setUint16(28, nombre.length, true);
    vistaCentral.setUint32(42, desplazamiento, true);
    central.set(nombre, 46);

    centrales.push(central);
    desplazamiento += cabecera.length + tamano;
  }

  const tamanoCentral = centrales.reduce((suma, parte) => suma + parte.length, 0);

  const fin = new Uint8Array(22);
  const vistaFin = new DataView(fin.buffer);
  vistaFin.setUint32(0, 0x06054b50, true);
  vistaFin.setUint16(8, entradas.length, true);
  vistaFin.setUint16(10, entradas.length, true);
  vistaFin.setUint32(12, tamanoCentral, true);
  vistaFin.setUint32(16, desplazamiento, true);

  const partes = [...locales, ...centrales, fin];
  const total = partes.reduce((suma, parte) => suma + parte.length, 0);
  const salida = new Uint8Array(total);
  let posicion = 0;
  for (const parte of partes) {
    salida.set(parte, posicion);
    posicion += parte.length;
  }
  return salida;
}

// ------------------------------------------------------------
//  Workbook
// ------------------------------------------------------------

export function crearXlsx(hojas: Hoja[], momento = new Date()): Blob {
  const codificador = new TextEncoder();
  const nombres = hojas.map((hoja, indice) => nombreDeHoja(hoja.nombre, indice));

  const tiposContenido =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    hojas
      .map(
        (_, indice) =>
          `<Override PartName="/xl/worksheets/sheet${indice + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
      )
      .join('') +
    `</Types>`;

  const relacionesRaiz =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`;

  const libro =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>` +
    nombres
      .map(
        (nombre, indice) =>
          `<sheet name="${escapar(nombre)}" sheetId="${indice + 1}" r:id="rId${indice + 1}"/>`,
      )
      .join('') +
    `</sheets></workbook>`;

  const relacionesLibro =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    hojas
      .map(
        (_, indice) =>
          `<Relationship Id="rId${indice + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${indice + 1}.xml"/>`,
      )
      .join('') +
    `<Relationship Id="rId${hojas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`;

  // Two styles: 0 is the normal one and 1 makes the header row bold.
  // It is the only thing needed.
  const estilos =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` +
    `<fills count="1"><fill><patternFill patternType="none"/></fill></fills>` +
    `<borders count="1"><border/></borders>` +
    `<cellStyleXfs count="1"><xf/></cellStyleXfs>` +
    `<cellXfs count="2"><xf xfId="0"/><xf xfId="0" fontId="1" applyFont="1"/></cellXfs>` +
    // Without this block, some readers warn that the normal style is
    // missing. Excel opens it anyway, but it is part of the format.
    `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
    `</styleSheet>`;

  const entradas: Entrada[] = [
    { nombre: '[Content_Types].xml', datos: codificador.encode(tiposContenido) },
    { nombre: '_rels/.rels', datos: codificador.encode(relacionesRaiz) },
    { nombre: 'xl/workbook.xml', datos: codificador.encode(libro) },
    { nombre: 'xl/_rels/workbook.xml.rels', datos: codificador.encode(relacionesLibro) },
    { nombre: 'xl/styles.xml', datos: codificador.encode(estilos) },
    ...hojas.map((hoja, indice) => ({
      nombre: `xl/worksheets/sheet${indice + 1}.xml`,
      datos: codificador.encode(hojaXml(hoja)),
    })),
  ];

  const zip = armarZip(entradas, momento);
  return new Blob([zip as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// Starts the download in the browser.
export function descargar(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  // It is released afterwards, to give the browser time to read the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
