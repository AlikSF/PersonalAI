import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, GripVertical, Loader2, ImageIcon, AlertTriangle } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  translations: {
    uploadImages: string;
    dragToReorder: string;
    uploading: string;
    dropHere: string;
    orClickToSelect: string;
    firstImageMain: string;
    deleteImageConfirm: string;
    deleteImageTitle: string;
    cancel: string;
    delete: string;
    deleting: string;
  };
}

const BUCKET_NAME = 'Photos';
const FOLDER_NAME = 'Admin Panel Images';

export function ImageUploader({ images, onChange, translations }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ index: number; url: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${FOLDER_NAME}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const extractFilePathFromUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/storage/v1/object/public/');
      if (pathParts.length > 1) {
        const fullPath = decodeURIComponent(pathParts[1]);
        const firstSlashIndex = fullPath.indexOf('/');
        if (firstSlashIndex > 0) {
          const bucket = fullPath.substring(0, firstSlashIndex);
          const filePath = fullPath.substring(firstSlashIndex + 1);
          if (bucket === BUCKET_NAME) {
            console.log('Extracted file path:', filePath);
            return filePath;
          }
        }
      }
      console.warn('Could not parse URL structure:', url);
      return null;
    } catch (error) {
      console.error('Error parsing URL:', error, url);
      return null;
    }
  };

  const deleteFromStorage = async (url: string): Promise<boolean> => {
    console.log('Attempting to delete image from storage:', url);
    const filePath = extractFilePathFromUrl(url);
    if (!filePath) {
      console.error('Could not extract file path from URL:', url);
      alert('Error: Could not determine file path to delete');
      return false;
    }

    if (!filePath.startsWith('Admin Panel Images/')) {
      console.log('Image is not in Admin Panel Images folder, skipping storage deletion:', filePath);
      return true;
    }

    console.log('Deleting file from bucket:', BUCKET_NAME, 'path:', filePath);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      alert(`Error deleting image: ${error.message}`);
      return false;
    }

    console.log('Successfully deleted file:', data);
    return true;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const url = await uploadFile(file);
      if (url) {
        newUrls.push(url);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, index: number, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ index, url });
  };

  const confirmDeleteImage = async () => {
    if (!confirmDelete) return;

    const { index, url } = confirmDelete;
    setDeleting(index);
    setConfirmDelete(null);

    const success = await deleteFromStorage(url);

    if (success) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    }

    setDeleting(null);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    onChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{translations.deleteImageTitle}</h3>
                <p className="text-slate-600 mt-1">{translations.deleteImageConfirm}</p>
                <div className="mt-4 p-2 bg-slate-100 rounded-lg">
                  <img
                    src={confirmDelete.url}
                    alt="Image to delete"
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                {translations.cancel}
              </button>
              <button
                type="button"
                onClick={confirmDeleteImage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {translations.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-600 font-medium">{translations.uploading}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-700 font-medium">{translations.dropHere}</p>
              <p className="text-slate-500 text-sm mt-1">{translations.orClickToSelect}</p>
            </div>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <GripVertical className="w-4 h-4" />
            {translations.dragToReorder}
          </p>
          <p className="text-xs text-slate-500">{translations.firstImageMain}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable={deleting !== index}
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  deleting === index
                    ? 'opacity-50'
                    : draggedIndex === index
                    ? 'opacity-50 border-blue-400 cursor-move'
                    : dragOverIndex === index
                    ? 'border-blue-500 scale-105 cursor-move'
                    : index === 0
                    ? 'border-emerald-400 ring-2 ring-emerald-200 cursor-move'
                    : 'border-slate-200 hover:border-slate-300 cursor-move'
                }`}
              >
                {deleting === index && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
                    <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                  </div>
                )}

                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>

                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium pointer-events-none">
                    Main
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, index, url)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                  disabled={deleting === index}
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                  {index + 1}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                  <GripVertical className="w-6 h-6 text-white opacity-0 group-hover:opacity-70 transition-opacity drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
