"use client"
import React, { useState, ChangeEvent } from 'react';

const UploadProfile: React.FC = () => {
  const MAX_FILES = 5; // Maximum number of files allowed
  const [websiteImages, setWebsiteImages] = useState<File[]>([]);
  const [appImages, setAppImages] = useState<File[]>([]);

  // Handle image uploads for the patient website
  const handleWebsiteImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + websiteImages.length > MAX_FILES) {
      alert(`You can only upload a maximum of ${MAX_FILES} images.`);
      return;
    }
    setWebsiteImages((prevImages) => [...prevImages, ...files].slice(0, MAX_FILES));
  };

  // Handle image uploads for the patient app
  const handleAppImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + appImages.length > MAX_FILES) {
      alert(`You can only upload a maximum of ${MAX_FILES} images.`);
      return;
    }
    setAppImages((prevImages) => [...prevImages, ...files].slice(0, MAX_FILES));
  };

  // Delete a selected image from website images
  const deleteWebsiteImage = (index: number) => {
    const updatedImages = websiteImages.filter((_, i) => i !== index);
    setWebsiteImages(updatedImages);
  };

  // Delete a selected image from app images
  const deleteAppImage = (index: number) => {
    const updatedImages = appImages.filter((_, i) => i !== index);
    setAppImages(updatedImages);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-[#0A8E8A] text-center">Upload Images</h1>

      {/* Upload Image for Patient Website */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="patient-website">
          Upload Images for Patient Website (Max {MAX_FILES})
        </label>
        <input
          id="patient-website"
          type="file"
          multiple
          accept="image/*"
          onChange={handleWebsiteImagesChange}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-[#0A8E8A] focus:border-[#0A8E8A]"
        />
        {/* Display selected website images */}
        {websiteImages.length > 0 && (
          <ul className="mt-4">
            {websiteImages.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-600">
                {file.name}
                <button
                  onClick={() => deleteWebsiteImage(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload Image for Patient App */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="patient-app">
          Upload Images for Patient App (Max {MAX_FILES})
        </label>
        <input
          id="patient-app"
          type="file"
          multiple
          accept="image/*"
          onChange={handleAppImagesChange}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-[#0A8E8A] focus:border-[#0A8E8A]"
        />
        {/* Display selected app images */}
        {appImages.length > 0 && (
          <ul className="mt-4">
            {appImages.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-600">
                {file.name}
                <button
                  onClick={() => deleteAppImage(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UploadProfile;
