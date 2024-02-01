import React from "react";

const FileUploader = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    onFileUpload(selectedFiles); // Trigger the callback to add files to the playlist
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
