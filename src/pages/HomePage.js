import homeImg from "./marvel-homepage.jpg"
import classes from "./HomePage.module.scss"

function HomePage() {
    return (
        <div className={classes.imagePosition}>
            <img src={homeImg} className={classes.image}></img>
        </div>
    )
}

export default HomePage;