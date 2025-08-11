import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { renderAsync } from 'docx-preview';

function DocxViewer() {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const onDrop = (acceptedFiles: any) => {
    setError('');
    const file = acceptedFiles[0];

    if (!file) return;

    setFileName(file.name);

    // Option 2: Using docx-preview (renders more accurate formatting)

    if (file.name.endsWith('.docx')) {
      const blob = new Blob([file], { type: file.type });

      renderAsync(
        blob,
        document.getElementById('docx-render') as HTMLElement
      ).catch(err => {
        setError('Failed to render the DOCX file.');
        console.error(err);
      });
    } else {
      setError('Please upload a .docx file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    multiple: false,
  });

  return (
    <div className='docx-viewer'>
      <div {...getRootProps()} className='dropzone'>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the .docx file here...</p>
        ) : (
          <p>Drag & drop a .docx file here, or click to select</p>
        )}
      </div>

      {error && <code style={{ color: 'red' }}>{error}</code>}

      {fileName && !error && (
        <div className='file-info'>
          <h3>{fileName}</h3>
        </div>
      )}

      {/* For docx-preview output */}
      <div id='docx-render' className='docx-render-container'></div>
    </div>
  );
}

export default DocxViewer;
