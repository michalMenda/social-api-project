import React, { useContext } from "react";
import Update from "./Update";
import Delete from "./DeleteItem";
import "../css/Photo.css";
import { PhotoContext } from "./Album";
function Photo({ photo }) {
    const { updatePhotos, deletePhotos } = useContext(PhotoContext);
    return (
        <div className="image-container">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <div className="photos-actions">
                <div className="actions-buttons">
                    <Update item={{id:photo.id,title:photo.title,url:photo.url,thumbnailUrl:photo.thumbnailUrl}} type='photos' updateDisplay={updatePhotos} />
                    <Delete id={photo.id} type='photos' deleteDisplay={deletePhotos} />
                </div>
            </div>
        </div>
    );
}

export default Photo;