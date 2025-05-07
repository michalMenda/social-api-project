import React, { useState, useContext, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlbumsContext } from "./Albums";
import useHandleDisplay from "./useHandleDisplay";
import Photo from "./Photo";
import Update from "./Update";
import Delete from "./DeleteItem";
import AddItem from "./AddItem";
import "../css/album.css";
import useHandleError from "./useHandleError";
export const PhotoContext = createContext();

function Album({ album }) {
    const [photos, setPhotos, updatePhotos, deletePhotos, addPhotos] = useHandleDisplay([]);
    const [showPhotos, setShowPhotos] = useState(false);
    const [noMorePhotos, setNoMorePhotos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoPage, setPhotoPage] = useState(1);
    const { updateAlbums, deleteAlbums, setDisplayChanged } = useContext(AlbumsContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleError } = useHandleError();
    const attributes = ["title", "url", "thumbnailUrl"];

    const openAlbumPhotos = async () => {
        if (photos.length > 0 && photoPage === 1) {
            setShowPhotos(true);
            navigate(`/users/${id}/albums/${album.id}/photos`);
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/photos/?albumId=${album.id}&_page=${photoPage}`);
            if (!response.ok) throw new Error("Failed to load photos. Please try again.");

            const result = await response.json();
            if (result && result.data.length > 0) {
                setPhotos((prevPhotos) => [...prevPhotos, ...result.data]);
                setPhotoPage((prevPage) => prevPage + 1);
                setShowPhotos(true);
            } else {
                setNoMorePhotos("No more photos to load.");
            }
        } catch (err) {
            handleError("getError", err);
            handleError("getError", err);
        } finally {
            setLoading(false);
            navigate(`/users/${id}/albums/${album.id}/photos`);
        }
    };

    const closePhotos = () => {
        setShowPhotos(false);
        navigate(`/users/${id}/albums`);
    };

    return (
        <div className="albumContainer">
            <p className="albumId">{album.id}</p>
            <p className="albumTitle">{album.title}</p>
            {noMorePhotos && <div className="error">{noMorePhotos}</div>}

            <PhotoContext.Provider value={{ updatePhotos, deletePhotos }}>
                <div className="album-actions">
                    <Update
                        item={{id:album.id,title:album.title}}
                        type="albums"
                        updateDisplay={updateAlbums}
                        setDisplayChanged={setDisplayChanged}
                    />
                    <Delete
                        id={album.id}
                        type="albums"
                        deleteDisplay={deleteAlbums}
                        setDisplayChanged={setDisplayChanged}
                        dependent="photos"
                    />
                    <button onClick={openAlbumPhotos} disabled={loading}>
                        {photoPage === 1 || !showPhotos ? "Show Photos" : "Load More Photos"}
                    </button>
                    <AddItem
                        keys={attributes}
                        type="photos"
                        addDisplay={addPhotos}
                        defaltValues={{ albumId: album.id }}
                    />
                </div>

                {showPhotos && (
                    <div className="overlay">
                        <div className="photoContainer modal">
                            <button className="close-btn" onClick={closePhotos}>
                                ×
                            </button>
                            <div className="photos-grid">
                                {photos.map((item) => (
                                    <Photo key={item.id} photo={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </PhotoContext.Provider>
        </div>
    );
}

export default Album;