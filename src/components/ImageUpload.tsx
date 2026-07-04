import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface ImageUploadProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

const ImageUpload = ({
  previewUrl,
  onFileSelect,
  onError,
  disabled,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!ALLOWED_TYPES.has(file.type)) {
      onError("Selecciona una imagen JPEG o PNG.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onError("La imagen no debe superar los 10 MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(event.dataTransfer.files);
  };

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="upload-card">
      <div
        className={`dropzone ${isDragging ? "dropzone--active" : ""} ${
          disabled ? "dropzone--disabled" : ""
        }`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa de la resonancia"
            className="dropzone__preview"
          />
        ) : (
          <div className="dropzone__placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14M14 8h.01M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="dropzone__title">Arrastra una resonancia magnética</p>
            <p className="dropzone__subtitle">
              o haz clic para seleccionar un archivo (JPG, PNG)
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleInputChange}
        disabled={disabled}
        hidden
      />

      {previewUrl && (
        <button className="btn btn--ghost" onClick={openFileDialog} disabled={disabled}>
          Cambiar imagen
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
