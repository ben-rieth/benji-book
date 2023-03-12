import { type FC, type MutableRefObject, useState, useRef } from "react";
import Image from 'next/image';
import Button from "../general/Button";
import classNames from "classnames";
import { AiOutlineDownload } from "react-icons/ai";
import Webcam from 'react-webcam';

type ImageUploadProps = {
    onChange: (file: File) => void;
    imageValue: File | null;
    rounded?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, imageValue, rounded=false }) => {
    const [previewImage, setPreviewImage] = useState<string>(() => {
        if (imageValue) return URL.createObjectURL(imageValue as Blob);
        return ""
    });

    const [webcamOpen, setWebcamOpen] = useState<boolean>(false);
    const fileInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const webcamRef: MutableRefObject<Webcam | null> = useRef(null);

    const handleFile = (file: File) => {
        onChange(file);
        setPreviewImage(URL.createObjectURL(file as Blob));
    }

    const takePicture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot() as string;

        const blob = await fetch(imageSrc).then(res => res.blob());
        handleFile(blob as File);
        setWebcamOpen(false);
    };

    return (
        <div>
            <div
                className={classNames(
                    "flex items-center justify-center w-full h-auto aspect-square bg-white cursor-pointer border-4 border-dashed overflow-hidden mb-3",
                    { "rounded-full": rounded, "rounded-lg" : !rounded }
                )}
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
                { !previewImage && !webcamOpen && (
                    <div className="flex flex-col justify-center items-center">
                        <AiOutlineDownload className="w-10 h-10" />
                        <p>Your Image Here</p>
                    </div>
                )}
                { previewImage && (
                    <div className="w-full h-full aspect-square relative">
                        <Image 
                            src={previewImage}
                            alt='user uploaded image'
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                {webcamOpen && (
                    <Webcam 
                        className="aspect-square w-full h-auto object-cover"
                        ref={webcamRef}
                        audio={false}
                        screenshotQuality={1}
                    />
                )}
            </div>
            {!webcamOpen ? (
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                        setWebcamOpen(true);
                        setPreviewImage("");
                    }}>
                    Use Camera
                </Button>
            ) : (
                <Button variant="filled" type="button" onClick={takePicture}>
                    Take Picture
                </Button>
            )}
            
            
        </div>
    )
};

export default ImageUpload;