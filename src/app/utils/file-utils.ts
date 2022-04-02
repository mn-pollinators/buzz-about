// Utility functions for downloading JSON data
// modified from https://github.com/Teradata/covalent

/**
 * Convert object to JSON format and download to file with .json
 * extension appended to the provided base file name.
 *
 * @param fileBaseName base name of destination file
 * @param object object to be converted to JSON format
 *   prior to writing to download destination
 * @param indent optional parameter indicating space indentation for pretty output. Default is 2
 */
export function downloadObjectToJSON(fileBaseName: string, object: any, indent: number = 2): void {
  downloadFile(`${fileBaseName}.json`, JSON.stringify(object, undefined, indent), 'application/json');
}

/**
 * Download string content to the specified file with desired mime type.
 *
 * @param fileName full filename (including appropriate extension) of destination file
 * @param contents string contents to be written to download destination
 * @param mimeType mime type appropriate to file content to support consumption of destination file
 */
export function downloadFile(fileName: string, contents: string, mimeType: string = 'text/plain'): void {
  if (!fileName || !contents) {
    return;
  }

  // Create blob object and assign URL
  const blob: Blob = new Blob([contents], { type: mimeType });
  const url: string = window.URL.createObjectURL(blob);

  // Construct anchor for URL, append to DOM, click and cleanup.
  const a: HTMLAnchorElement = document.createElement('a');
  a.setAttribute('style', 'display: none');
  a.setAttribute('download', fileName);
  a.href = url;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
