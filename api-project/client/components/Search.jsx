import React, { useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { fetchData } from "../js-files/GeneralRequests";
import useHandleError from "./useHandleError";
import "../css/search.css";

function Search({ type, searchItems, setItems, items, displayChanged, setDisplayChanged }) {
    const [attribute, setAttribute] = useState("id");
    const [allItems, setAllItems] = useState(items);
    const [firstSearch, setFirstSearch] = useState(false);
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const {handleError}=useHandleError();
    const searchValue = searchParams.get(attribute) || "";

    const searchItemsArray = async (inputValue) => {
        setSearchParams({ [attribute]: inputValue });
        if (!firstSearch) {
            setFirstSearch(true);
            setAllItems(items);
        }

        if (displayChanged) {
            const fetchedItems = await fetchData(type,"userId", id,handleError);
            setAllItems(fetchedItems);
            setDisplayChanged(false);
        }
        const filteredItems = allItems?.filter((item) => {
            const value = item[attribute];
            if (typeof value === "boolean") {
                if (inputValue === "") return true;
                return value === (inputValue.toLowerCase() === "true");
            }
            return value && value.toString().toLowerCase().includes(inputValue.toLowerCase());
        });
        setItems(inputValue ? filteredItems : allItems);
    };

    return (
        <div className="search-container">
            <h2>Search</h2>
            <select
                className="search-dropdown"
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
            >
                <option value="" disabled>Select an option</option>
                {searchItems.map((value, index) => (
                    <option key={index} value={value}>
                        {value}
                    </option>
                ))}
            </select>
            <input
                type="text"
                className="search-input"
                placeholder={`Search by ${attribute}...`}
                value={searchValue}
                onChange={(e) => searchItemsArray(e.target.value)}
            />
        </div>
    );
}

export default Search;
