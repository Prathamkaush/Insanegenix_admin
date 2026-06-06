"use client";

import { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { api } from "@/lib/api";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const [step, setStep] = useState<"upload" | "validate" | "process" | "complete">(
    "upload"
  );
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [imageZip, setImageZip] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [processResults, setProcessResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const allowedDataFormats = [".csv", ".xlsx", ".xls"];
  const allowedZipFormat = [".zip"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          allowedDataFormats.some((fmt) =>
            file.name.toLowerCase().endsWith(fmt)
          )
        ) {
          setDataFile(file);
        } else if (
          allowedZipFormat.some((fmt) =>
            file.name.toLowerCase().endsWith(fmt)
          )
        ) {
          setImageZip(file);
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDataFile(file);
  };

  const handleZipSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageZip(file);
  };

  const validateUpload = async () => {
    if (!dataFile) {
      setError("Please select a data file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("dataFile", dataFile);
      if (imageZip) formData.append("imageZip", imageZip);

      const res = await api.post(
        "/products/bulk-upload-enhanced/validate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setValidationResults(res.data);
      setStep("validate");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Validation failed. Please check your file."
      );
    } finally {
      setLoading(false);
    }
  };

  const processUpload = async () => {
    if (!dataFile) {
      setError("Please select a data file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("dataFile", dataFile);
      if (imageZip) formData.append("imageZip", imageZip);

      const res = await api.post(
        "/products/bulk-upload-enhanced",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProcessResults(res.data);
      setStep("complete");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const res = await api.get("/products/bulk-upload/template-enhanced", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-upload-template-enhanced.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download template");
    }
  };

  const downloadSample = async () => {
    try {
      const res = await api.get("/products/bulk-upload/sample-enhanced", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-upload-sample-enhanced.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download sample");
    }
  };

  const downloadInstructions = async () => {
    try {
      const res = await api.get("/products/bulk-upload/instructions", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bulk-upload-instructions.txt";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download instructions");
    }
  };

  const resetModal = () => {
    setStep("upload");
    setDataFile(null);
    setImageZip(null);
    setValidationResults(null);
    setProcessResults(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto text-white backdrop-blur-md">
        {/* HEADER */}
        <div className="sticky top-0 bg-zinc-900 px-8 py-6 flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white">
              Bulk Upload Products
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {step === "upload" && "Upload CSV/Excel with optional images"}
              {step === "validate" && "Review validation results"}
              {step === "process" && "Processing your products"}
              {step === "complete" && "Upload completed!"}
            </p>
          </div>
          <button
            onClick={resetModal}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <CloseIcon className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {/* UPLOAD STEP */}
          {step === "upload" && (
            <div className="space-y-6">
              {/* FILE UPLOAD AREA */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragActive
                    ? "border-brandRed bg-brandRed/5"
                    : "border-white/10 bg-white/5 hover:border-brandRed/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <CloudUploadIcon
                  className={`mx-auto mb-4 text-4xl transition-colors ${
                    dragActive ? "text-brandRed" : "text-zinc-600"
                  }`}
                />
                <h3 className="text-lg font-bold text-white mb-2">
                  Drop your data file here
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-block px-6 py-2.5 bg-brandRed text-white rounded-lg font-black uppercase tracking-widest hover:bg-white hover:text-brandBlack transition-colors"
                >
                  Select File
                </button>

                {dataFile && (
                  <div className="mt-6 p-4 bg-green-950/20 border border-green-800/30 text-green-400 rounded-lg">
                    <p className="text-green-300 font-semibold text-sm">
                      ✓ {dataFile.name} selected
                    </p>
                  </div>
                )}
              </div>

              {/* IMAGE ZIP (OPTIONAL) */}
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase">
                  Optional: Images ZIP File
                </label>
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleZipSelect}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-xl p-6 text-center hover:border-brandRed/50 transition-colors cursor-pointer"
                  onClick={() => zipInputRef.current?.click()}>
                  <p className="text-sm text-zinc-400 mb-2">
                    {imageZip ? (
                      <span className="text-green-400 font-semibold">
                        ✓ {imageZip.name}
                      </span>
                    ) : (
                      "Click to select ZIP file with product images"
                    )}
                  </p>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="p-4 bg-red-950/20 border border-red-800/30 text-red-400 rounded-lg flex gap-3 items-start">
                  <ErrorIcon className="text-brandRed flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* HELPERS */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 rounded-lg text-sm font-semibold text-zinc-400 hover:border-brandRed hover:text-brandRed hover:bg-white/10 transition-colors"
                >
                  <DownloadIcon fontSize="small" />
                  Template
                </button>
                <button
                  onClick={downloadSample}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 rounded-lg text-sm font-semibold text-zinc-400 hover:border-brandRed hover:text-brandRed hover:bg-white/10 transition-colors"
                >
                  <DownloadIcon fontSize="small" />
                  Sample
                </button>
                <button
                  onClick={downloadInstructions}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 rounded-lg text-sm font-semibold text-zinc-400 hover:border-brandRed hover:text-brandRed hover:bg-white/10 transition-colors"
                >
                  <DownloadIcon fontSize="small" />
                  Guide
                </button>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={resetModal}
                  className="flex-1 px-6 py-2.5 border border-white/10 rounded-lg font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={validateUpload}
                  disabled={!dataFile || loading}
                  className="flex-1 px-6 py-2.5 bg-brandRed text-white rounded-lg font-black uppercase tracking-widest hover:bg-white hover:text-brandBlack disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Validating..." : "Next: Validate"}
                </button>
              </div>
            </div>
          )}

          {/* VALIDATE STEP */}
          {step === "validate" && validationResults && (
            <div className="space-y-6">
              {/* SUMMARY */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-950/20 border border-blue-800/30 rounded-lg">
                  <p className="text-2xl font-black text-blue-400">
                    {validationResults.data.total}
                  </p>
                  <p className="text-xs font-semibold text-blue-300 uppercase">
                    Total Products
                  </p>
                </div>
                <div className="p-4 bg-green-950/20 border border-green-800/30 rounded-lg">
                  <p className="text-2xl font-black text-green-400">
                    {validationResults.data.valid}
                  </p>
                  <p className="text-xs font-semibold text-green-300 uppercase">
                    Valid Rows
                  </p>
                </div>
                <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
                  <p className="text-2xl font-black text-red-400">
                    {validationResults.data.invalid}
                  </p>
                  <p className="text-xs font-semibold text-red-300 uppercase">
                    Invalid Rows
                  </p>
                </div>
              </div>

              {/* IMAGE STATS */}
              {validationResults.data.imageStats && (
                <div className="p-4 bg-purple-950/20 border border-purple-800/30 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-3">
                    Image Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {validationResults.data.imageStats.totalInZip}
                      </p>
                      <p className="text-xs text-purple-300">In ZIP</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {validationResults.data.imageStats.referenced}
                      </p>
                      <p className="text-xs text-purple-300">Referenced</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {validationResults.data.imageStats.unreferenced.length}
                      </p>
                      <p className="text-xs text-purple-300">Unused</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ERRORS */}
              {validationResults.data.errors.length > 0 && (
                <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
                  <h3 className="font-semibold text-red-300 mb-3">
                    Errors ({validationResults.data.errors.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationResults.data.errors.slice(0, 10).map((err: any, i: number) => (
                      <div key={i} className="text-sm p-2 bg-zinc-950/60 rounded border border-red-800/30 text-white">
                        <p className="font-semibold text-red-400">
                          Row {err.rowNumber}: {err.title}
                        </p>
                        {err.errors.map((e: string, j: number) => (
                          <p key={j} className="text-red-400/90 ml-2">
                            • {e}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WARNINGS */}
              {validationResults.data.warnings.length > 0 && (
                <div className="p-4 bg-yellow-950/20 border border-yellow-800/30 rounded-lg">
                  <h3 className="font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                    <WarningIcon fontSize="small" />
                    Warnings ({validationResults.data.warnings.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationResults.data.warnings.slice(0, 5).map((warn: any, i: number) => (
                      <div key={i} className="text-sm p-2 bg-zinc-950/60 rounded border border-yellow-800/30 text-white">
                        <p className="font-semibold text-yellow-400">
                          Row {warn.rowNumber}: {warn.title}
                        </p>
                        {warn.warnings.map((w: string, j: number) => (
                          <p key={j} className="text-yellow-400/90 ml-2">
                            • {w}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => setStep("upload")}
                  className="flex-1 px-6 py-2.5 border border-white/10 rounded-lg font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("process")}
                  disabled={validationResults.data.valid === 0}
                  className="flex-1 px-6 py-2.5 bg-brandRed text-white rounded-lg font-black uppercase tracking-widest hover:bg-white hover:text-brandBlack disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Proceed with Upload
                </button>
              </div>
            </div>
          )}

          {/* PROCESS STEP */}
          {step === "process" && (
            <div className="space-y-6 py-12 text-center">
              <div className="inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-brandRed border-t-transparent animate-spin mx-auto mb-4"></div>
              </div>
              <h3 className="text-xl font-bold text-white">
                Processing Your Products...
              </h3>
              <p className="text-zinc-400">
                This may take a few moments depending on file size
              </p>
              <div className="w-full bg-white/10 rounded-full h-1">
                <div className="bg-brandRed h-1 rounded-full animate-pulse" style={{ width: "65%" }}></div>
              </div>
              <button
                onClick={processUpload}
                disabled={loading}
                className="px-6 py-2.5 bg-brandRed text-white rounded-lg font-semibold hover:bg-brandRed disabled:opacity-50 hidden"
              >
                {loading ? "Processing..." : "Start Processing"}
              </button>
            </div>
          )}

          {/* COMPLETE STEP */}
          {step === "complete" && processResults && (
            <div className="space-y-6 py-6">
              <div className="text-center">
                <CheckCircleIcon className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">
                  Upload Complete!
                </h3>
                <p className="text-zinc-400">
                  Your products have been successfully imported
                </p>
              </div>

              {/* RESULTS SUMMARY */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-950/20 border border-blue-800/30 rounded-lg">
                  <p className="text-2xl font-black text-blue-400">
                    {processResults.data.total}
                  </p>
                  <p className="text-xs font-semibold text-blue-300 uppercase">
                    Total
                  </p>
                </div>
                <div className="p-4 bg-green-950/20 border border-green-800/30 rounded-lg">
                  <p className="text-2xl font-black text-green-400">
                    {processResults.data.successful}
                  </p>
                  <p className="text-xs font-semibold text-green-300 uppercase">
                    Successful
                  </p>
                </div>
                <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
                  <p className="text-2xl font-black text-red-400">
                    {processResults.data.failed}
                  </p>
                  <p className="text-xs font-semibold text-red-300 uppercase">
                    Failed
                  </p>
                </div>
              </div>

              {/* IMAGE STATS */}
              {processResults.data.imageInfo && (
                <div className="p-4 bg-purple-950/20 border border-purple-800/30 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-3">
                    Images Processed
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {processResults.data.imageInfo.totalImages}
                      </p>
                      <p className="text-xs text-purple-300">Total in ZIP</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {processResults.data.imageInfo.usedImages}
                      </p>
                      <p className="text-xs text-purple-300">Used</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-400">
                        {processResults.data.imageInfo.unusedImages}
                      </p>
                      <p className="text-xs text-purple-300">Unused</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESSFUL PRODUCTS */}
              {processResults.data.successfulProducts &&
                processResults.data.successfulProducts.length > 0 && (
                  <div className="p-4 bg-green-950/20 border border-green-800/30 rounded-lg max-h-48 overflow-y-auto">
                    <h3 className="font-semibold text-green-300 mb-3">
                      Sample Products Added
                    </h3>
                    <div className="space-y-2">
                      {processResults.data.successfulProducts
                        .slice(0, 5)
                        .map((p: any, i: number) => (
                          <div
                            key={i}
                            className="text-sm p-2 bg-zinc-950/60 rounded border border-green-800/30 text-white"
                          >
                            <p className="font-semibold text-green-400">
                              {p.title}
                            </p>
                            <p className="text-xs text-green-300/80">
                              ID: {p.productId} • Row {p.rowNumber}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* ERRORS */}
              {processResults.data.errors &&
                processResults.data.errors.length > 0 && (
                  <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg max-h-48 overflow-y-auto">
                    <h3 className="font-semibold text-red-300 mb-3">
                      Failed Rows ({processResults.data.errors.length})
                    </h3>
                    <div className="space-y-2">
                      {processResults.data.errors.slice(0, 5).map((err: any, i: number) => (
                        <div
                          key={i}
                          className="text-sm p-2 bg-zinc-950/60 rounded border border-red-800/30 text-white"
                        >
                          <p className="font-semibold text-red-400">
                            Row {err.rowNumber}: {err.title}
                          </p>
                          <p className="text-xs text-red-300">{err.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={resetModal}
                  className="flex-1 px-6 py-2.5 border border-white/10 rounded-lg font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    resetModal();
                    if (onSuccess) onSuccess();
                  }}
                  className="flex-1 px-6 py-2.5 bg-brandRed text-white rounded-lg font-black uppercase tracking-widest hover:bg-white hover:text-brandBlack transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}