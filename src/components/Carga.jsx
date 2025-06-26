import React from "react";

const Loader = () => {
    return (
        <div className="loader-container">
          <div className="loader">
            <style>
              {`
                .loader-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                .loader {
                  width: 65px;
                  aspect-ratio: 1;
                  position: relative;
                }
                .loader:before,
                .loader:after {
                  content: "";
                  position: absolute;
                  border-radius: 50px;
                  box-shadow: 0 0 0 3px inset #205598;
                  animation: l4 2.5s infinite;
                }
                .loader:after {
                  animation-delay: -1.25s;
                }
                @keyframes l4 {
                  0% {
                    inset: 0 35px 35px 0;
                  }
                  12.5% {
                    inset: 0 35px 0 0;
                  }
                  25% {
                    inset: 35px 35px 0 0;
                  }
                  37.5% {
                    inset: 35px 0 0 0;
                  }
                  50% {
                    inset: 35px 0 0 35px;
                  }
                  62.5% {
                    inset: 0 0 0 35px;
                  }
                  75% {
                    inset: 0 0 35px 35px;
                  }
                  87.5% {
                    inset: 0 0 35px 0;
                  }
                  100% {
                    inset: 0 35px 35px 0;
                  }
                }
              `}
            </style>
          </div>
        </div>
      );
      
};

export default Loader;

