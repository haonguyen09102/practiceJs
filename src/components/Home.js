import logohome from "../assets/images/img qlns.jpg";
import "./Home.scss";
const Home = () => {
    return (
        <div className="responsive-image-container">
            <img
                src={logohome}
                alt="Your Image Alt Text"
                className="responsive-image"
            />
        </div>
    )

}

export default Home;