import { useEffect, useState } from "react";
import GradCamViewer from "./components/GradCamViewer";
import ImageUpload from "./components/ImageUpload";
import PredictionResult from "./components/PredictionResult";
import { predictImage } from "./services/api";
import { PredictionResponse } from "./types/prediction";
import "./index.css";

const DISCLAIMER = "Resultado académico de apoyo; no constituye diagnóstico médico.";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await predictImage(selectedFile));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <div className="app__logo">N</div>
          <div>
            <h1>NeuroScan AI</h1>
            <p>
              Clasificación preliminar de tumores cerebrales mediante resonancia
              magnética
            </p>
          </div>
        </div>
      </header>

      <main className="app__main">
        <section className="app__panel">
          <ImageUpload
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onError={setError}
            disabled={loading}
          />

          <button
            className="btn btn--primary"
            onClick={handlePredict}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Analizando resonancia…
              </>
            ) : (
              "Analizar resonancia"
            )}
          </button>

          {error && (
            <div className="alert alert--error">
              <strong>No se pudo completar el análisis.</strong>
              <span>{error}</span>
            </div>
          )}
        </section>

        <section className="app__panel">
          {!result && !loading && !error && (
            <div className="empty-state">
              <p>
                Selecciona una resonancia y presiona “Analizar resonancia” para
                ver el resultado.
              </p>
            </div>
          )}
          <PredictionResult result={result} />
          {result && (
            <GradCamViewer
              gradcamImage={result.gradcam_image}
              originalImage={previewUrl}
            />
          )}
        </section>
      </main>

      <footer className="app__footer">
        <p className="app__warning">{DISCLAIMER}</p>
        <p>Proyecto académico — NeuroScan AI © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
