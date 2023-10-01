import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import './fileUpload.css'
function FileUpload({ onFileUpload }) {
    const onDrop = useCallback((acceptedFiles) => {
        // Process the uploaded files here
        onFileUpload(acceptedFiles);
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, maxFiles: 1, accept: {
            'text/csv': [],
        }
    });

    return (
        <div  {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here...</p>
            ) : (
                <p>Drag & drop some files here, or click to select files<br />
                    Only CSV Accepted
                </p>

            )}
        </div>
    );
}
FileUpload.propTypes = {
    onFileUpload: PropTypes.func.isRequired,
};
export default FileUpload;