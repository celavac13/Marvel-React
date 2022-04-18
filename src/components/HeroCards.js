import React from 'react';
import { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

import classes from "./HeroCards.module.scss";

function HeroCards({ heros }) {
    const [pageNumber, setPageNumber] = useState(0);
    const [remountComponent, setRemountComponent] = useState(0);

    const herosPerPage = 12;
    const herosVisited = pageNumber * herosPerPage;
    const pageCount = Math.ceil(heros.length / herosPerPage);

    // handling like button
    const likeHandler = (key, obj, event) => {
        if (localStorage.hasOwnProperty(key)) {
            localStorage.removeItem(key)
            event.target.innerHTML = "Like";
        } else {
            obj.status = true;
            localStorage.setItem(key, JSON.stringify(obj));
            event.target.innerHTML = "Liked";
        }
    }

    // function for creating hero components
    const displayHeros = heros
        .slice(herosVisited, herosVisited + herosPerPage)
        .map(hero => {
            const objLocalStorage = {
                id: hero.id,
                image: hero.image,
                name: hero.name,
                status: false
            }
            return (
                <div key={hero.id} className={classes.heroDiv}>
                    <div className={classes.imageDiv}>
                        <img className={classes.image} src={hero.image}></img>
                    </div>
                    <div className={classes.nameDiv}>
                        <p className={classes.heroName}>{hero.name}</p>
                        <button className={classes.btn} onClick={(event) => likeHandler(hero.id, objLocalStorage, event)}>{hero.status ? "Liked" : "Like"}</button>
                    </div>
                </div>
            );
        });

    // optimising pagination
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        setRemountComponent(Math.random());
        setPageNumber(0);
    }, [heros]);

    const showPagination = () => {
        if (pageCount > 1) {
            return (
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={classes.paginationBtns}
                    disabledClassName={classes.disabledBtn}
                    activeClassName={classes.activeBtn}
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                />
            )
        }
    }

    return (
        <div className={classes.position} key={remountComponent}>
            {displayHeros}
            {showPagination()}
        </div>
    )
}

export default HeroCards;