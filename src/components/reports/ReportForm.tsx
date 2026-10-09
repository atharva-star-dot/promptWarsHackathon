import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Upload, AlertTriangle, ShieldAlert, CheckCircle, MapPin } from 'lucide-react';
import { ReportType, CitizenReport } from '../../types';
import { useCityStore } from '../../store/useCityStore';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
}) => {
  const { selectedCity, addReport } = useCityStore();

  const [type, setType] = useState<ReportType>('unsafe');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key (WCAG 2.1 AA dialog pattern)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lat = initialLat || selectedCity.latitude;
  const lng = initialLng || selectedCity.longitude;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access unavailable or denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a brief description.');
      return;
    }

    const newReport: CitizenReport = {
      id: `report-${Date.now()}`,
      cityId: selectedCity.name,
      type,
      description,
      photoUrl,
      audioBlobUrl: audioUrl,
      lat,
      lng,
      createdAt: new Date().toISOString(),
    };

    addReport(newReport);
    onClose();
    alert('Report submitted successfully! Saved locally to device.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div
        ref={modalRef}
        className="glass-panel w-full max-w-lg rounded-3xl p-6 relative border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report dialog"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="report-modal-title" className="text-xl font-bold text-white">
              File Citizen Community Report
            </h2>
            <p id="report-modal-desc" className="text-xs text-slate-400">
              Community report (local to your device) for {selectedCity.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Type */}
          <fieldset>
            <legend className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Issue Category
            </legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Issue category">
              {(['unsafe', 'accident', 'pothole', 'flooding'] as ReportType[]).map((t) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={type === t}
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize flex items-center gap-2 transition-all ${
                    type === t
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  {t === 'unsafe' ? 'Unsafe Area' : t}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <label htmlFor="report-description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description <span className="text-rose-400" aria-hidden="true">*</span>
            </label>
            <textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the condition, location landmarks, or hazards..."
              rows={3}
              className="w-full p-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Coordinates hint */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>Target Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
          </div>

          {/* Photo Upload & Voice Note */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Photo */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 mb-1">
                Attach Photo
              </span>
              <label className="cursor-pointer flex items-center justify-center gap-2 p-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-xl text-xs text-slate-300 transition-colors focus-within:ring-2 focus-within:ring-indigo-400">
                <Upload className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>{photoUrl ? 'Photo Attached ✓' : 'Upload Image'}</span>
                <input
                  type="file"
                  aria-label="Upload incident photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Voice Note */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 mb-1">
                Voice Memo
              </span>
              {!isRecording ? (
                <button
                  type="button"
                  aria-label={audioUrl ? 'Re-record voice memo' : 'Record voice memo'}
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-xl text-xs text-slate-300 transition-colors"
                >
                  <Mic className="w-4 h-4 text-rose-400" aria-hidden="true" />
                  {audioUrl ? 'Re-record Voice' : 'Record Voice'}
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Stop audio recording"
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold animate-pulse"
                >
                  <Square className="w-4 h-4" aria-hidden="true" /> Stop Recording
                </button>
              )}
            </div>
          </div>

          {audioUrl && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-xl border border-emerald-800/40" role="status">
              <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> Voice memo attached successfully.
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg glow-indigo transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
