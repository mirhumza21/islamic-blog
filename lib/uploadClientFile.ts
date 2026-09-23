export async function uploadClientFile(
  file: File
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload-file", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Upload failed" };
    }

    return { success: true, fileUrl: data.url };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network error during upload",
    };
  }
}
