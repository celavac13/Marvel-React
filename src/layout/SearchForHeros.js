import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

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
    const [errorMsg, setErrorMsg] = useState(null);
    const [localReRender, setLocalReRender] = useState(0)

    const inputOnChange = e => setInputChanged(e.target.value);

    const debounceOnChange = debounce(inputOnChange, 1000);

    const reRenderFunc = (data) => setLocalReRender(localReRender + data);

    // getting data from marvel develop site, or local storage
    useEffect(() => {
        if (inputChanged !== "") {
            fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputChanged}&limit=99&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)
                .then(res => {
                    if (!res.ok) {
                        throw Error("Something went wrong");
                    }
                    return res.json();
                })
                .then(res => {
                    setErrorMsg(null);
                    return res.data.results;
                })
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
                })
                .catch(err => setErrorMsg(err.message))
        } else {
            const heroFromStorage = Object.values({ ...localStorage })
                .map(el => JSON.parse(el))
            setAllHeros(heroFromStorage);
        }
    }, [inputChanged, localReRender]);
    return (
        <div className={classes.position}>
            <header className={classes.header}>
                <input type="text" className={classes.input} placeholder="Search for your favorite hero" onChange={debounceOnChange} ></input>
            </header>
            {errorMsg && <div>{errorMsg}</div>}
            <HeroCards heros={allHeros} reRender={reRenderFunc} />
            {localStorage.length === 0 && inputChanged === "" ? <HomePage /> : null}
        </div>

    );
}

export default SearchForHeros;