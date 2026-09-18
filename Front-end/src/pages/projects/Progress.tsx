import { useEffect, useState } from "react";
import { TrendingUp, Upload, Image as ImageIcon, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_CONFIG } from "@/services/api/config";
import { getProjects, updateProject, getProjectPhotos, uploadProjectPhoto, deleteProjectPhoto } from "@/services/projects.service";

export default function ProjectProgressPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => getProjects().then(setProjects).catch((reason: any) => setError(reason.message || "Failed to load progress"));
  useEffect(() => { load(); }, []);

  const loadPhotos = async (projectId: string) => {
    try {
      const data = await getProjectPhotos(projectId);
      setPhotos(data || []);
    } catch {
      setPhotos([]);
    }
  };

  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
    setPhotos([]);
    loadPhotos(project.id);
  };

  const handleUpdate = async (data: { completionStatus: number }) => {
    if (!selectedProject) return;
    try {
      await updateProject(selectedProject.id, { constructionProgress: data.completionStatus });
      setSelectedProject(null);
      setPhotos([]);
      await load();
    } catch (reason: any) {
      setError(reason.message || "Failed to update project progress");
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedProject || !photoFile || !photoTitle.trim()) return;
    setUploading(true);
    try {
      const photo = await uploadProjectPhoto(selectedProject.id, photoTitle.trim(), photoFile);
      setPhotos((current) => [photo, ...current]);
      setUploadOpen(false);
      setPhotoTitle("");
      setPhotoFile(null);
    } catch (reason: any) {
      setError(reason.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (projectId: string, photoId: string) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await deleteProjectPhoto(projectId, photoId);
      setPhotos((current) => current.filter((photo) => photo.id !== photoId));
    } catch (reason: any) {
      setError(reason.message || "Failed to delete photo");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <div className="border-b border-[#1E3E37] pb-4">
        <h1 className="text-2xl font-bold text-white">Construction Progress</h1>
        <p className="mt-1 text-xs text-[#829B96]">Live project progress tracking and construction photo gallery</p>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="space-y-3">
        {projects.map((project) => {
          const progress = Number(project.constructionProgress || 0);
          const isSelected = selectedProject?.id === project.id;
          return (
            <div key={project.id} className={`rounded-xl border ${isSelected ? 'border-[#10B981]' : 'border-[#1E3E37]'} bg-[#112421] p-4`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-[#10B981]">{project.projectCode}</p>
                  <h2 className="mt-1 font-semibold text-white">{project.projectName}</h2>
                  <p className="text-xs text-[#829B96]">{project.location} • {project.status}</p>
                </div>
                <Button size="sm" onClick={() => handleSelectProject(project)} className={`gap-1.5 ${isSelected ? '' : 'bg-[#10B981] text-slate-950'}`}>
                  <TrendingUp className="h-3.5 w-3.5" /> {isSelected ? 'Selected' : 'Update'}
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#0B1816]">
                  <div className="h-full bg-[#10B981]" style={{ width: `${progress}%` }} />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-white">{progress}%</span>
              </div>
              {isSelected && (
                <div className="mt-4 space-y-4">
                  {/* Photo Gallery */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#10B981]" />
                        Construction Photos ({photos.length})
                      </h3>
                      <Button
                        size="sm"
                        className="bg-[#10B981] text-slate-950"
                        onClick={() => setUploadOpen(true)}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1" /> Add Photo
                      </Button>
                    </div>
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {photos.map((photo) => (
                          <div key={photo.id} className="relative rounded-lg border border-[#1E3E37] bg-[#0B1816] overflow-hidden group">
                            <img
                              src={`${API_CONFIG.baseURL}/projects/${selectedProject.id}/photos/${photo.id}/download`}
                              alt={photo.title}
                              className="w-full h-32 object-cover"
                              onError={(event) => { (event.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div className="p-2">
                              <p className="text-xs text-white truncate">{photo.title}</p>
                              <p className="text-[10px] text-[#829B96]">{new Date(photo.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                              onClick={() => handleDeletePhoto(selectedProject.id, photo.id)}
                              className="absolute top-1 right-1 bg-rose-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-[#1E3E37] p-6 text-center">
                        <ImageIcon className="h-6 w-6 text-[#829B96] mx-auto mb-2" />
                        <p className="text-xs text-[#829B96]">No photos uploaded yet</p>
                      </div>
                    )}
                  </div>
                  {/* Progress Update */}
                  <div className="rounded-xl border border-[#1E3E37] bg-[#0B1816] p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Update Progress</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setSelectedProject({ ...selectedProject, constructionProgress: value });
                        }}
                        className="flex-1 accent-[#10B981]"
                      />
                      <span className="w-12 text-right text-sm font-semibold text-white">{progress}%</span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        className="bg-[#10B981] text-slate-950"
                        onClick={() => handleUpdate({ completionStatus: selectedProject.constructionProgress })}
                      >
                        Save Progress
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!projects.length && !error && <p className="rounded-xl border border-[#1E3E37] p-10 text-center text-sm text-[#829B96]">No projects found.</p>}
      </div>
      {uploadOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5">
            <h3 className="font-semibold text-white">Upload Construction Photo</h3>
            <input
              required
              value={photoTitle}
              onChange={(event) => setPhotoTitle(event.target.value)}
              placeholder="Photo description"
              className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"
            />
            <input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
              className="w-full text-sm text-white"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setUploadOpen(false); setPhotoTitle(""); setPhotoFile(null); }}>Cancel</Button>
              <Button disabled={uploading || !photoFile || !photoTitle.trim()} onClick={handlePhotoUpload} className="bg-[#10B981] text-slate-950">
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
