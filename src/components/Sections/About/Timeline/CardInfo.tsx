import { CARD_INFO } from "@constant";
import type { PlacaDolly } from "@types";

interface Props {
  placa: PlacaDolly;
  /** `dolly` = tarjeta del escenario; `movil` = tarjeta del carrusel. */
  variante: "dolly" | "movil";
  /** Acción del botón "Leer más" (abrir el detalle de la placa). */
  onAccion?: () => void;
}

/**
 * Cuerpo de la tarjeta de información: los bloques y el botón salen de
 * `CARD_INFO` (@constant), así que añadir un dato a la card o cambiar su
 * orden es tocar esa constante, no este componente. Los bloques sin dato no se
 * pintan, de modo que una placa sin resumen no deja un hueco.
 */
export default function CardInfo({ placa, variante, onAccion }: Props) {
  const clase = (dolly: string, movil: string) =>
    variante === "dolly" ? dolly : movil;

  return (
    <>
      {CARD_INFO.bloques.map(({ campo, clase: cDolly, claseMovil }) => {
        const texto = placa[campo];
        if (!texto) return null;

        return campo === "titulo" ? (
          <h3 key={campo} className={clase(cDolly, claseMovil)}>
            {texto}
          </h3>
        ) : (
          <p key={campo} className={clase(cDolly, claseMovil)}>
            {texto}
          </p>
        );
      })}

      <button
        type="button"
        className={clase(CARD_INFO.accion.clase, CARD_INFO.accion.claseMovil)}
        onClick={(e) => {
          e.stopPropagation();
          onAccion?.();
        }}
      >
        {CARD_INFO.accion.etiqueta}
      </button>
    </>
  );
}
