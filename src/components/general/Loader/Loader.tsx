import type { FC } from "react";
import styles from './Loader.module.css';

type LoaderProps = {
    text?: string
}

const Loader:FC<LoaderProps> = ({ text }) => {
    return (
        <div className="flex flex-col w-full items-center">
            <span className={styles.loader} />
            {text && <p>{text}</p>}
        </div>
    )
}

export default Loader;