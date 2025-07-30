import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  // Returns a Promise that resolves with a base64 cropped image
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const diameter = Math.min(image.width, image.height);
      canvas.width = diameter;
      canvas.height = diameter;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.beginPath();
      ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      // Calculate cropping area
      const sx = crop.x * image.width / 100;
      const sy = crop.y * image.height / 100;
      const sWidth = diameter / zoom;
      const sHeight = diameter / zoom;
      ctx.drawImage(
        image,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        diameter,
        diameter
      );
      ctx.restore();
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = reject;
  });
}

const CircularCropModal = ({ open, imageSrc, onApply, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    // Crop the image and return the result
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
    onApply(croppedImage);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-lg font-bold mb-4 text-center">Crop Your Photo</h2>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-32"
            />
          </label>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircularCropModal; 