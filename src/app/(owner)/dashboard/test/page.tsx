'use client';

import React, { useState } from 'react';

const UploadExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file Excel trước.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);
    setDocxUrl(null);

    try {
      const response = await fetch('https://localhost:7267/api/inventoryimport/create-from-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload thất bại: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDocxUrl(url);
    } catch (err) {
      setError((err as Error).message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Upload file Excel và nhận DOCX</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="border p-2"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Đang upload...' : 'Upload'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {docxUrl && (
        <a
          href={docxUrl}
          download="file.docx"
          className="text-green-600 underline mt-4"
        >
          Tải file DOCX
        </a>
      )}
    </div>
  );
};

export default UploadExcel;
