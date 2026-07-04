interface GradCamViewerProps {
  gradcamImage: string | null;
  originalImage: string | null;
}

const GradCamViewer = ({ gradcamImage, originalImage }: GradCamViewerProps) => {
  if (!gradcamImage) return null;

  return (
    <div className="gradcam-card">
      <h4 className="gradcam-card__title">Mapa de activación (Grad-CAM)</h4>
      <p className="gradcam-card__subtitle">
        Muestra las regiones que más influyeron en la predicción. No representa
        una segmentación ni una localización exacta del tumor y puede resaltar
        bordes, fondos o marcas externas.
      </p>
      <div className="gradcam-card__images">
        {originalImage && (
          <div className="gradcam-card__column">
            <span className="gradcam-card__label">Original</span>
            <img src={originalImage} alt="Resonancia original" />
          </div>
        )}
        <div className="gradcam-card__column">
          <span className="gradcam-card__label">Grad-CAM</span>
          <img src={gradcamImage} alt="Mapa de calor Grad-CAM" />
        </div>
      </div>
    </div>
  );
};

export default GradCamViewer;
