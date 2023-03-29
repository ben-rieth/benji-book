import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BsArchive } from "react-icons/bs";

export const EditIcon = () => (
    <AiFillEdit 
        className={"fill-sky-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-sky-600"} 
    />
);

export const DeleteIcon = () => (
    <AiFillDelete className="fill-red-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-red-600" />
);

export const ArchiveIcon = () => (
    <BsArchive className="fill-emerald-500 w-6 h-6 cursor-pointer hover:scale-100 hover:fill-emerald-600"/>
)