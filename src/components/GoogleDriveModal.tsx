import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Reality } from '../types/multiverse.ts';
import {
  googleSignIn,
  googleLogout,
  getAccessToken,
  initAuth
} from '../services/firebaseAuth.ts';
import {
  listDriveFiles,
  saveRealityToDrive,
  loadRealityFromDrive,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDriveService.ts';
import {
  X,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  FileText,
  HardDrive,
  LogOut,
  FolderOpen
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeReality: Reality | undefined;
  onImportReality: (reality: Reality) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  activeReality,
  onImportReality
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation state for destructive delete
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchFiles = async (accessToken: string, query: string = '') => {
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      const driveFiles = await listDriveFiles(accessToken, query);
      setFiles(driveFiles);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to list Google Drive files');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await fetchFiles(res.accessToken);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User voluntarily dismissed popup, cleanly abort without setting errorMsg
        return;
      }
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await googleLogout();
    setUser(null);
    setToken(null);
    setFiles([]);
  };

  const handleUploadActiveReality = async () => {
    if (!token) {
      // If not logged in, trigger login first
      await handleLogin();
      return;
    }
    if (!activeReality) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploadSuccess(null);
    try {
      const uploaded = await saveRealityToDrive(token, activeReality);
      setUploadSuccess(`Successfully exported "${activeReality.name}" state, ${activeReality.laws.length} laws, and ${activeReality.history.length} history commits to Google Drive as ${uploaded.name}`);
      await fetchFiles(token, searchQuery);
      setTimeout(() => setUploadSuccess(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to export reality to Google Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadLocalJson = () => {
    if (!activeReality) return;
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const sanitizedName = activeReality.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `NullVoid_${activeReality.id}_${sanitizedName}_${timestampStr}.json`;
    const exportPayload = {
      $schema: 'https://nullvoid.sandbox/schemas/reality-v1.json',
      archiveFormat: 'NullVoid-Reality-Archive-v1.0',
      exportedAt: new Date().toISOString(),
      hypervisorVersion: '1.0-KERNEL',
      hermeticContainment: {
        externalWorkDeltaJoules: 0.0,
        hostLoadDecoupled: true,
        unitsFramework: activeReality.unitsFramework,
      },
      state: {
        id: activeReality.id,
        name: activeReality.name,
        designation: activeReality.designation,
        blueprint: activeReality.blueprint,
        stratum: activeReality.stratum,
        dimensionality: activeReality.dimensionality,
        status: activeReality.status,
        currentVersion: activeReality.currentVersion,
        stepCount: activeReality.stepCount,
        entropyRelational: activeReality.entropyRelational,
        expansionRatio: activeReality.expansionRatio,
        createdAt: activeReality.createdAt,
        updatedAt: activeReality.updatedAt,
      },
      laws: activeReality.laws,
      entities: activeReality.entities,
      anomalies: activeReality.anomalies,
      history: activeReality.history,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: DriveFileItem) => {
    if (!token) return;
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      const importedReality = await loadRealityFromDrive(token, file.id);
      onImportReality(importedReality);
      setUploadSuccess(`Imported "${importedReality.name}" into Multiverse Hypervisor!`);
      setTimeout(() => {
        setUploadSuccess(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import reality from Drive');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const confirmDelete = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setFileToDelete(null);
      await fetchFiles(token, searchQuery);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete file from Google Drive');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#080d1a] border border-slate-700/80 rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Google Drive Multiverse Sync & Storage
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{errorMsg}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Active Reality Export Card (Always visible, works for any active reality) */}
          {activeReality && (
            <div className="p-3.5 bg-[#05070c] border border-cyan-900/60 rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 uppercase tracking-wider">
                      ACTIVE REALITY EXPORT
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {activeReality.currentVersion}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      activeReality.status === 'ACTIVE'
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50'
                        : activeReality.status === 'DORMANT'
                        ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                        : 'text-slate-400 bg-slate-900 border-slate-700'
                    }`}>
                      {activeReality.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mt-1">
                    {activeReality.name} <span className="text-slate-400 font-mono text-xs">({activeReality.id})</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {activeReality.dimensionality} · {activeReality.stratum} stratum · {activeReality.unitsFramework}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadLocalJson}
                    className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center gap-1.5 transition-colors"
                    title="Download raw JSON archive locally"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>

                  <button
                    onClick={handleUploadActiveReality}
                    disabled={isUploading || isLoggingIn}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                    <span>
                      {isUploading
                        ? 'Exporting to Drive...'
                        : user
                        ? 'Export to Google Drive (.json)'
                        : 'Sign in & Export to Drive'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Payload Breakdown: State, Laws, History */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800/70 text-[11px]">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                  <span className="text-slate-400 font-mono text-[10px] block">1. STATE VECTOR</span>
                  <span className="font-semibold text-slate-200">
                    Step {activeReality.stepCount} · S_rel: {activeReality.entropyRelational.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Ratio: {activeReality.expansionRatio.toFixed(2)}x
                  </span>
                </div>

                <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                  <span className="text-cyan-400 font-mono text-[10px] block">2. COMPILED LAWS</span>
                  <span className="font-semibold text-slate-200">
                    {activeReality.laws.length} Axioms & Laws
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {activeReality.laws.map(l => l.category).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'Void State'}
                  </span>
                </div>

                <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                  <span className="text-emerald-400 font-mono text-[10px] block">3. HISTORY LEDGER</span>
                  <span className="font-semibold text-slate-200">
                    {activeReality.history.length} Version Commits
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Immutable chronological timeline
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Authentication & Account Section */}
          {!user ? (
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg text-center space-y-3">
              <HardDrive className="w-7 h-7 text-cyan-400 mx-auto opacity-80" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Google Drive Authentication
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Connect your Google account to enable direct cloud export of your universe states, axioms, and historical ledgers.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="pt-1 flex justify-center">
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-white text-slate-800 hover:bg-slate-100 rounded-md font-medium text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected User Profile */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-cyan-400">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">
                      {user.displayName || 'Google Account'}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Drive File Browser */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && token && fetchFiles(token, searchQuery)}
                      placeholder="Search Google Drive files..."
                      className="w-full bg-[#05070c] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={() => token && fetchFiles(token, searchQuery)}
                    disabled={isLoadingFiles}
                    className="p-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg transition-colors"
                    title="Refresh Files"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>

                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800/60 max-h-[260px] overflow-y-auto bg-[#05070c]">
                  {files.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      {isLoadingFiles ? 'Loading Google Drive...' : 'No files found in Google Drive.'}
                    </div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 hover:bg-slate-900/50 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {file.isNullVoidArchive ? (
                            <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-medium text-slate-200 truncate">
                                {file.name}
                              </h5>
                              {file.isNullVoidArchive && (
                                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                                  NullVoid Archive
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.name.endsWith('.json') && (
                            <button
                              onClick={() => handleImport(file)}
                              className="px-2 py-1 text-[11px] text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 rounded flex items-center gap-1 transition-colors"
                              title="Import reality into sandbox"
                            >
                              <Download className="w-3 h-3" />
                              <span>Import</span>
                            </button>
                          )}

                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Delete file from Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#05070c] flex items-center justify-between text-[11px] text-slate-400">
          <span>Hermetic Isolation: Drive sync requires explicit user permission</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-white rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Mandatory User Confirmation Modal for Destructive Delete */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-[#0b101e] border border-rose-900/60 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-100">
                Confirm Delete from Google Drive
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{fileToDelete.name}"</strong> from your Google Drive? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
