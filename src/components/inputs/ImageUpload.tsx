import { type FC, type MutableRefObject, useState, useRef } from "react";
import Image from 'next/image';

type ImageUploadProps = {
    onChange: (file: File) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange }) => {
    const [previewImage, setPreviewImage] = useState("");
    const fileInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    
    const handleFile = (file: File) => {
        onChange(file);
        setPreviewImage(URL.createObjectURL(file as Blob));
    }

    return (
        <div
            className="flex items-center justify-center w-full h-auto aspect-square bg-white cursor-pointer border-4 border-dashed rounded-lg overflow-hidden"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
                e.preventDefault();
                e.stopPropagation();

                if (e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0]
                    handleFile(file);
                }

                
            }}
            onClick={() => fileInputRef.current?.click()}
        >
            <input 
                type="file" 
                accept='image/*' 
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        if (file) handleFile(file);
                    }
                }}
            />
            { previewImage ? (
                <div className="w-full h-full aspect-square relative">
                    <Image 
                        src={previewImage}
                        alt='user uploaded image'
                        fill
                        className="object-contain"
                    />
                </div>
            ) : (
                <p>Your Image Here</p>
            )} 
        </div>
    )
};

export default ImageUpload;