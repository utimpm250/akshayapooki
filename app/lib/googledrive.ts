export const GOOGLE_DRIVE_CONFIG = {
  folderId: "1YVeNMiaHVOqkX-FGNUpIsJ4SCQdE4MhH",

  apiKey: "AIzaSyCpvQGEz9aI8CWIjXXM5Nvupzssn5i8TcU",

  fields:
    "files(id,name,mimeType,size,modifiedTime,iconLink,webViewLink,webContentLink,thumbnailLink)",

  pageSize: 1000,
};

export const DRIVE_ENDPOINT = (
  folderId: string,
  apiKey: string
) =>
  `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=${GOOGLE_DRIVE_CONFIG.fields}&pageSize=${GOOGLE_DRIVE_CONFIG.pageSize}&key=${apiKey}`;