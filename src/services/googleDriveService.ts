import { Reality } from '../types/multiverse.ts';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  description?: string;
  isNullVoidArchive?: boolean;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List files in user's Google Drive, prioritizing NullVoid multiverse archives
 */
export async function listDriveFiles(accessToken: string, queryFilter: string = ''): Promise<DriveFileItem[]> {
  try {
    let q = "trashed = false";
    if (queryFilter.trim()) {
      q += ` and name contains '${queryFilter.replace(/'/g, "\\'")}'`;
    }

    const url = new URL(`${DRIVE_API_BASE}/files`);
    url.searchParams.set('q', q);
    url.searchParams.set('fields', 'files(id, name, mimeType, modifiedTime, size, description)');
    url.searchParams.set('pageSize', '30');
    url.searchParams.set('orderBy', 'modifiedTime desc');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Failed to list files: ${res.statusText}`);
    }

    const data = await res.json();
    return (data.files || []).map((f: any) => ({
      ...f,
      isNullVoidArchive: f.name?.startsWith('NullVoid_') || f.description?.includes('NullVoid Sandbox Reality Archive'),
    }));
  } catch (error: any) {
    console.error('Error listing Google Drive files:', error);
    throw error;
  }
}

/**
 * Uploads a reality state, full history, and compiled laws as a structured JSON file directly to Google Drive
 */
export async function saveRealityToDrive(accessToken: string, reality: Reality): Promise<DriveFileItem> {
  try {
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const sanitizedName = reality.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `NullVoid_${reality.id}_${sanitizedName}_${timestampStr}.json`;

    // Complete structured export payload
    const exportPayload = {
      $schema: 'https://nullvoid.sandbox/schemas/reality-v1.json',
      archiveFormat: 'NullVoid-Reality-Archive-v1.0',
      exportedAt: new Date().toISOString(),
      hypervisorVersion: '1.0-KERNEL',
      hermeticContainment: {
        externalWorkDeltaJoules: 0.0,
        hostLoadDecoupled: true,
        unitsFramework: reality.unitsFramework,
      },
      // 1. Reality state metadata & metrics
      state: {
        id: reality.id,
        name: reality.name,
        designation: reality.designation,
        blueprint: reality.blueprint,
        stratum: reality.stratum,
        dimensionality: reality.dimensionality,
        status: reality.status,
        currentVersion: reality.currentVersion,
        stepCount: reality.stepCount,
        entropyRelational: reality.entropyRelational,
        expansionRatio: reality.expansionRatio,
        createdAt: reality.createdAt,
        updatedAt: reality.updatedAt,
      },
      // 2. Complete compiled axioms and laws
      laws: reality.laws,
      // 3. Materialized entities
      entities: reality.entities,
      // 4. Anomalies & singularities
      anomalies: reality.anomalies,
      // 5. Immutable chronological history ledger
      history: reality.history,
    };

    const fileContent = JSON.stringify(exportPayload, null, 2);

    const metadata = {
      name: filename,
      mimeType: 'application/json',
      description: `NullVoid Sandbox Reality Archive for ${reality.name} (${reality.id}). State: [${reality.status}], Version: ${reality.currentVersion}, Laws: ${reality.laws.length}, Entities: ${reality.entities.length}, Commits: ${reality.history.length}.`,
    };

    // Multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,description,webViewLink`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Failed to upload to Drive: ${res.statusText}`);
    }

    const created = await res.json();
    return {
      ...created,
      isNullVoidArchive: true,
    };
  } catch (error: any) {
    console.error('Error saving reality to Google Drive:', error);
    throw error;
  }
}

/**
 * Reads/Downloads a reality archive JSON from Google Drive and reconstructs the Reality
 */
export async function loadRealityFromDrive(accessToken: string, fileId: string): Promise<Reality> {
  try {
    const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to download file from Drive: ${res.statusText}`);
    }

    const rawData = await res.json();

    // Check if it's the structured export format
    if (rawData.archiveFormat && rawData.state && Array.isArray(rawData.laws)) {
      return {
        id: rawData.state.id,
        name: rawData.state.name,
        designation: rawData.state.designation || 'IMPORTED_REALITY',
        blueprint: rawData.state.blueprint || '',
        stratum: rawData.state.stratum || 'HYBRID',
        dimensionality: rawData.state.dimensionality || '3D Non-Euclidean',
        unitsFramework: rawData.state.unitsFramework || 'DIMENSIONLESS_RELATIONAL',
        status: 'DORMANT', // Always import in dormant state per Meta-Law 002
        currentVersion: rawData.state.currentVersion || 'v1.0',
        stepCount: rawData.state.stepCount || 0,
        entropyRelational: rawData.state.entropyRelational || 0.05,
        expansionRatio: rawData.state.expansionRatio || 1.0,
        laws: rawData.laws || [],
        entities: rawData.entities || [],
        anomalies: rawData.anomalies || [],
        history: rawData.history || [],
        createdAt: rawData.state.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Direct reality object fallback
    if (rawData.id && rawData.name && Array.isArray(rawData.laws)) {
      return {
        ...rawData,
        status: 'DORMANT',
        updatedAt: new Date().toISOString(),
      };
    }

    throw new Error('File is not a recognized NullVoid Reality Archive JSON format.');
  } catch (error: any) {
    console.error('Error loading reality from Google Drive:', error);
    throw error;
  }
}

/**
 * Deletes a file from Google Drive (Mandatory user confirmation must precede this call!)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  try {
    const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Failed to delete file from Drive: ${res.statusText}`);
    }
  } catch (error: any) {
    console.error('Error deleting file from Google Drive:', error);
    throw error;
  }
}
