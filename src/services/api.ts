import { PredictionResponse } from "../types/prediction";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function predictImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/predict/`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Comprueba que la API esté disponible.",
    );
  }

  if (!response.ok) {
    let message = `Error del servidor (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody?.detail) message = errorBody.detail;
    } catch {
      // Se conserva el mensaje genérico si la respuesta no contiene JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<PredictionResponse>;
}
