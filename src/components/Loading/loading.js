import React, { useState, CSSProperties } from "react";
import Spline from '@splinetool/react-spline';



function LoadingIcon({customClassName,splineClass}) {
  let [loading, setLoading] = useState(true);
  //   let [color, setColor] = useState("#ffffff");
  // const { customClassName, spline } = props;
  return (
    <React.Fragment>
        {
            loading && 
            <div className={"loadingDiv "+ customClassName}>
              your custom loading symbol
            </div>

        }
        
    
  </React.Fragment>
  );
}

export default LoadingIcon;