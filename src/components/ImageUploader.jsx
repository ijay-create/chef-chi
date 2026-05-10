import { useRef, useState } from "react";
import "../styles/imageUploader.css";


const ImageUploader = ({
  onUpload,
  uploading,
  progress,
}) => {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];

    if (!file) return;

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`image-uploader ${
        dragging ? "dragging" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          handleFiles(e.target.files)
        }
      />

      {!uploading ? (
        <>
          <p>📸 Drag & Drop Image</p>
          <span>or click to upload</span>
        </>
      ) : (
        <div className="upload-progress">
          <p>Uploading... {progress}%</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;