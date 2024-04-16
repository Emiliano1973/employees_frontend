import React from "react";
import ReactLoading from "react-loading";
import './LoadingComponent.css';


const LoadingComponent =()=>{
    return (
        <div className="containerLoading">
            <ReactLoading  type="bubbles" color="#0000FF" 
                height={100} width={50} className="centerLoading" />
        </div>
    );
};

export default LoadingComponent;