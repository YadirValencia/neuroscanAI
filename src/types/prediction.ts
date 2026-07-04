export type TumorClass = "glioma" | "meningioma" | "no_tumor" | "pituitary_tumor";

export interface Probabilities {
  glioma: number;
  meningioma: number;
  no_tumor: number;
  pituitary_tumor: number;
}

export interface PredictionResponse {
  predicted_class: TumorClass;
  display_name: string;
  confidence: number;
  probabilities: Probabilities;
  gradcam_image: string;
  warning: string;
}
