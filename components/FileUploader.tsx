"use client";

import { IKImage, IKVideo, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  const response = await fetch("/api/auth/imagekit");
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Auth request failed: ${response.status} ${errText}`);
  }
  return response.json(); // expects { token, expire, signature }
};

interface Props {
  type: "image" | "video";
  accept: string; // e.g. 'image/*'
  placeholder: string;
  folder?: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const styles = {
    dropzone:
      variant === "dark"
        ? "bg-dark-300 border-dark-100"
        : "bg-light-600 border-gray-300",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (err: any) => {
    setIsUploading(false);
    setProgress(0);
    console.error("Upload error:", err);
    toast({
      title: "Upload failed",
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (resJson: any) => {
    setIsUploading(false);
    setProgress(100);
    const path = resJson.filePath ?? resJson.url ?? "";
    setFile({ filePath: path });
    onFileChange(path);
    toast({
      title: "Success",
      description: `${path} uploaded successfully!`,
    });
  };

  const onValidate = (f: File) => {
    if (type === "image" && f.size > 20 * 1024 * 1024) {
      toast({
        title: "Too large",
        description: "Please upload an image smaller than 20MB.",
        variant: "destructive",
      });
      return false;
    }
    if (type === "video" && f.size > 50 * 1024 * 1024) {
      toast({
        title: "Too large",
        description: "Please upload a video smaller than 50MB.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Upload via XHR to ImageKit with progress tracking
  const uploadToImageKit = useCallback(
    async (fileObj: File) => {
      try {
        if (!onValidate(fileObj)) return;

        const auth = await authenticator(); // { token, expire, signature }
        const form = new FormData();
        form.append("file", fileObj);
        form.append("fileName", fileObj.name);
        form.append("publicKey", publicKey);
        // server returns signature/token/expire
        if (auth.signature) form.append("signature", auth.signature);
        if (auth.token) form.append("token", auth.token);
        if (auth.expire) form.append("expire", String(auth.expire));
        if (folder) form.append("folder", folder);
        // optional unique name flag
        form.append("useUniqueFileName", "true");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const resJson = JSON.parse(xhr.responseText);
              onSuccess(resJson);
            } else {
              onError(xhr.responseText || `Status ${xhr.status}`);
            }
          } catch (err) {
            onError(err);
          }
        };

        xhr.onerror = () => {
          onError("Network error during upload.");
        };

        setIsUploading(true);
        setProgress(0);
        xhr.send(form);
      } catch (err) {
        onError(err);
      }
    },
    [folder],
  );

  // Dropzone setup
  const acceptObj = accept ? { [accept]: [] } : undefined;
  const onDrop = useCallback(
    
    (acceptedFiles: File[]) => {
      const dropped = acceptedFiles[0];
      if (!dropped) return;
      uploadToImageKit(dropped);
    },
    [uploadToImageKit],
    
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptObj,
  });

  useEffect(() => {

    if (isDragActive) {
      setShowImage(true)
    }
  }, [isDragActive])
  

  return (
    <div onClick={ () => setShowImage(true)} >
      <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
        
      >
        {/* Dropzone (click or drop) */}
        <div
          {...getRootProps()}
          
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer p-6 transition",
            styles.dropzone,
            isDragActive ? "opacity-80 border-green-500 bg-green-50" : "opacity-100"
          )}
        >
          <input {...getInputProps()} />
          <Image
            src="/assets/icons/upload.svg"
            alt="upload-icon"
            width={20}
            height={20}
            className="object-contain mb-2 min-w-10"
            
          />
          <p className={cn("text-base", styles.placeholder)}>
            {isDragActive ? "Drop your file here..." : placeholder}
          </p>

          {file?.filePath && (
            <p className={cn("mt-2 dark:text-gray-300 mb-3 text-sm", styles.text)}>{file.filePath}</p>
          )}
        </div>

        {/* Progress */}
        {isUploading && progress > 0 && progress < 100 && (
          <div className="w-full mt-2 rounded-full bg-gray-200">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Preview */}
        {file?.filePath && 
          (type === "image" ? (
            <div className={cn("mt-3 ", showImage  ? "block" : "hidden")}>
              <IKImage alt={file.filePath} path={file.filePath} width={500} height={300} />
            </div>
          ) : (
            type === "video" && (
              <div className="mt-3">
                <IKVideo path={file.filePath} controls className="h-96 w-full rounded-xl" />
              </div>
            )
          ))}
      </ImageKitProvider>
    </div>
  );
};

export default FileUpload;
