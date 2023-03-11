import { AiFillEdit, AiFillDelete } from "react-icons/ai";

export const EditIcon = () => (
    <AiFillEdit 
        className={"fill-sky-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-sky-600"} 
    />
);

export const DeleteIcon = () => (
    <AiFillDelete className="fill-red-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-red-600" />
);