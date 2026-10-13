'use client';

import { useTranslation } from 'react-i18next';
import '../../styles/nuevo.css';

// "New" ribbon for the corner of a card. The card must be
// `position: relative` and clip its overflow; the ones that are not
// already add the `rt_tarjeta_con_etiqueta` class.
export default function EtiquetaNuevo() {
  const { t } = useTranslation('global');
  return <span className="rt_etiqueta_nuevo">{t('global.new_item')}</span>;
}
