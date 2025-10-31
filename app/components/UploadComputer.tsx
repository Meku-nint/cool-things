"use client";

import { useState, useRef } from 'react';

export default function UploadComputer() {
  const [count, setCount] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function postData(payload?: { name?: string; count?: number; file?: File }) {
    setLoading(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append('count', String(payload?.count ?? count));
      if (payload?.name ?? name) form.append('name', payload?.name ?? name);
      if (payload?.file) form.append('file', payload.file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');
      setStatus('Saved to database');
    } catch (err: any) {
      setStatus(err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }
  async function onFileChange() {
    const input = fileRef.current;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    await postData({ name: name || undefined, count, file });
  }

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-md shadow">
      <h3 className="text-lg font-medium mb-2">Upload Computer Post</h3>

      <label className="block text-sm text-zinc-700">Name (optional)</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mt-1 mb-3 px-3 py-2 border rounded"
        placeholder="e.g. Office PCs"
      />

      <label className="block text-sm text-zinc-700">Number of computers</label>
      <input
        type="number"
        min={0}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-32 mt-1 mb-3 px-3 py-2 border rounded"
      />

      <label className="block text-sm text-zinc-700">Select file to attach (optional)</label>
      <input ref={fileRef} type="file" onChange={onFileChange} className="mt-1 mb-3" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => postData({ name: name || undefined, count })}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save to DB'}
        </button>
        <button
          onClick={() => {
            if (fileRef.current) fileRef.current.value = '';
            setStatus(null);
          }}
          className="px-3 py-2 border rounded"
        >
          Reset
        </button>
      </div>

      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
