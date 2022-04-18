import { useState, useEffect } from "react";

import HeroCards from "../components/HeroCards";
import HomePage from "../pages/HomePage";
import classes from "./SearchForHeros.module.scss";

const PRIVATE_KEY = "e15d639155873cc8b9966690dd2e8cd81e5d92ba";
const PUBLIC_KEY = "af370fa6380b86a0bebb3109e70f57e3";
let ts = new Date().getTime();
let md5 = require("md5");
let hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

function SearchForHeros() {
    const [inputChanged, setInputChanged] = useState("");
    const [allHeros, setAllHeros] = useState([]);

    function inputOnChange(e) {
        setTimeout(() => {
            setInputChanged(e.target.value);
        }, 2000);
    }

    // getting data from marvel develop site, or local storage
    useEffect(() => {
        if (inputChanged !== "") {
            fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputChanged}&limit=99&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)
                .then(res => res.json())
                .then(res => res.data.results)
                .then(res => {
                    const allHerosArr = [];
                    res.forEach(el => {
                        if (localStorage.hasOwnProperty(el.id)) {
                            const heroObj = JSON.parse(localStorage.getItem(el.id));
                            allHerosArr.push(heroObj)
                        } else {
                            const heroObj = {
                                id: el.id,
                                name: el.name,
                                image: el.thumbnail.path + "/portrait_incredible." + el.thumbnail.extension,
                                status: false
                            }
                            allHerosArr.push(heroObj);
                        }
                    });
                    setAllHeros(allHerosArr);
                });
        } else {
            const heroFromStorage = Object.values({ ...localStorage })
                .map(el => JSON.parse(el))
            setAllHeros(heroFromStorage);
        }
    }, [inputChanged]);
    return (
        <div className={classes.position}>
            <header className={classes.header}>
                <input type="text" className={classes.input} placeholder="Search for your favorite hero" onChange={inputOnChange} ></input>
            </header>
            <HeroCards heros={allHeros} />
            {localStorage.length === 0 && inputChanged === "" ? <HomePage /> : null}
        </div>

    );
}

export default SearchForHeros;