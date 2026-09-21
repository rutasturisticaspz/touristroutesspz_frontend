'use client';

import Reveal from '../Reveal';

// Título de sección. Mismas clases que el sitio anterior.
export default function Sectitle({
  Title,
  TitleP = '',
  tClass = '',
  sClass = '',
}: {
  Title: string;
  TitleP?: string;
  tClass?: string;
  sClass?: string;
}) {
  return (
    <div className={sClass}>
      <Reveal effect="fadeInUp" duration={1300}>
        <h2 className={`f_p f_size_30 l_height50 f_600 ${tClass}`}>{Title}</h2>
      </Reveal>
      <Reveal effect="fadeInUp" duration={1600}>
        <p className="f_400 f_size_16 mb-0">{TitleP}</p>
      </Reveal>
    </div>
  );
}
