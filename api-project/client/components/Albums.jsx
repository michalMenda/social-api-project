import React, { useState, useEffect, createContext } from "react";
import Album from "./Album";
import AddItem from "./AddItem";
import Search from "./Search";
import { fetchData } from "../js-files/GeneralRequests";
import useHandleDisplay from "./useHandleDisplay";
import useHandleError from "./useHandleError";
export const AlbumsContext = createContext();

function Albums({ id }) {
    const [albums, setAlbums, updateAlbums, deleteAlbums, addAlbums] = useHandleDisplay([]);
    const [displayChanged, setDisplayChanged] = useState(false);
    const { handleError } = useHandleError();
    const albumAttributes = ["title"];

    useEffect(() => {
        const fetchAlbums = async () => {
            const fetchedAlbums = await fetchData("albums", "userId", id, handleError);
            setAlbums(fetchedAlbums);
        };
        fetchAlbums();
    }, [id]);

    return (
        <AlbumsContext.Provider value={{ updateAlbums, deleteAlbums, setDisplayChanged }}>
            <div>
                <Search
                    type="albums"
                    searchItems={["id", "title"]}
                    setItems={setAlbums}
                    items={albums}
                    displayChanged={displayChanged}
                    setDisplayChanged={setDisplayChanged}
                />
                <AddItem
                    keys={albumAttributes}
                    type="albums"
                    addDisplay={addAlbums}
                    defaltValues={{ userId: id }}
                    setDisplayChanged={setDisplayChanged}
                />
                {albums && albums.length > 0 ? (
                    albums.map((album) => <Album key={album.id} album={album} />)
                ) : (
                    <p>No albums found.</p>
                )}
            </div>
        </AlbumsContext.Provider>
    );
}

export default Albums;
