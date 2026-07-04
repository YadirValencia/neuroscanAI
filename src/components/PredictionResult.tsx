import { PredictionResponse, TumorClass } from "../types/prediction";

interface PredictionResultProps {
  result: PredictionResponse | null;
}

const CLASS_INFO: Record<TumorClass, { label: string; color: string; description: string }> = {
  glioma: {
    label: "Posible glioma",
    color: "#e0473e",
    description:
      "El modelo identificó patrones compatibles con la clase glioma. Se recomienda valoración profesional.",
  },
  meningioma: {
    label: "Posible meningioma",
    color: "#e8923b",
    description:
      "El modelo identificó patrones compatibles con la clase meningioma. Se recomienda evaluación profesional.",
  },
  no_tumor: {
    label: "Sin tumor clasificado",
    color: "#2fb37c",
    description:
      "El modelo no identificó patrones de las tres clases tumorales estudiadas. Esto no descarta otras alteraciones.",
  },
  pituitary_tumor: {
    label: "Posible tumor pituitario",
    color: "#e8923b",
    description:
      "El modelo identificó patrones compatibles con la clase tumor pituitario. Se recomienda evaluación profesional.",
  },
};

const PROBABILITY_ORDER: TumorClass[] = [
  "glioma",
  "meningioma",
  "no_tumor",
  "pituitary_tumor",
];

const PredictionResult = ({ result }: PredictionResultProps) => {
  if (!result) return null;

  const info = CLASS_INFO[result.predicted_class];

  return (
    <div className="result-card">
      <div className="result-card__header" style={{ borderColor: info.color }}>
        <span className="result-card__badge" style={{ backgroundColor: info.color }}>
          {result.display_name || info.label}
        </span>
        <span className="result-card__confidence">
          {result.confidence.toFixed(1)}% de confianza
        </span>
      </div>

      <p className="result-card__description">{info.description}</p>

      <div className="probabilities">
        <h4 className="probabilities__title">Distribución de probabilidades</h4>
        {PROBABILITY_ORDER.map((key) => {
          const value = result.probabilities[key];
          return (
            <div className="probabilities__row" key={key}>
              <span className="probabilities__label">{CLASS_INFO[key].label}</span>
              <div className="probabilities__track">
                <div
                  className="probabilities__fill"
                  style={{ width: `${value}%`, backgroundColor: CLASS_INFO[key].color }}
                />
              </div>
              <span className="probabilities__value">{value.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      <div className="disclaimer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p>
          {result.warning ||
            "Resultado académico de apoyo; no constituye diagnóstico médico."}
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;
