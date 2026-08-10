export const GOOGLE_DRIVE_CONFIG = {
  // Application Forms folder
  folderId: "1YVeNMiaHVOqkX-FGNUpIsJ4SCQdE4MhH",

  // Same Google Drive API key
  apiKey: "AIzaSyCpvQGEz9aI8CWIjXXM5Nvupzssn5i8TcU",

  fields:
    "files(id,name,mimeType,size,modifiedTime,iconLink,webViewLink,webContentLink,thumbnailLink)",

  pageSize: 1000,
};

// Resume Templates Google Drive folder
export const RESUME_DRIVE_CONFIG = {
  folderId: "13BGbZ7GT3KN1zZ5yqFDKVUBw3AnoyADX",
  apiKey: GOOGLE_DRIVE_CONFIG.apiKey,
  fields: GOOGLE_DRIVE_CONFIG.fields,
  pageSize: GOOGLE_DRIVE_CONFIG.pageSize,
};

export const DRIVE_ENDPOINT = (
  folderId: string,
  apiKey: string,
  fields = GOOGLE_DRIVE_CONFIG.fields,
  pageSize = GOOGLE_DRIVE_CONFIG.pageSize
) => {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed=false`,
    fields,
    pageSize: String(pageSize),
    key: apiKey,
  });

  return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
};

// Application Forms endpoint
export const APPLICATION_FORMS_DRIVE_ENDPOINT = DRIVE_ENDPOINT(
  GOOGLE_DRIVE_CONFIG.folderId,
  GOOGLE_DRIVE_CONFIG.apiKey
);

// Resume Templates endpoint
export const RESUME_DRIVE_ENDPOINT = DRIVE_ENDPOINT(
  RESUME_DRIVE_CONFIG.folderId,
  RESUME_DRIVE_CONFIG.apiKey,
  RESUME_DRIVE_CONFIG.fields,
  RESUME_DRIVE_CONFIG.pageSize
);