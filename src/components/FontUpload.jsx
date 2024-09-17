import React, { useState } from 'react';

const FontUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        validateFile(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        validateFile(file);
    };

    const validateFile = (file) => {
        if (file && file.type === 'font/ttf') {
            console.log('TTF file uploaded:', file.name);
            setErrorMessage('');
        } else {
            setErrorMessage('Only TTF file allowed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`border-2 border-dashed ${dragActive ? 'border-blue-500' : 'border-gray-300'} rounded-lg w-full max-w-md h-48 flex flex-col items-center justify-center bg-gray-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept=".ttf"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                        <img src="/upload-icon.svg" alt="Upload Icon" className="w-12 h-12" />
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-gray-400">Only TTF File Allowed</p>
                    </div>
                </label>
            </div>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
};

export default FontUpload;
