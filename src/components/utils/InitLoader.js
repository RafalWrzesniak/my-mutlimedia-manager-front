import React, { useState, useEffect } from 'react';
import '../../css/loader.css';
import { RingLoader } from 'react-spinners';
import ProgressBar from "@ramonak/react-progress-bar";

const InitLoader = ({ loading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setProgress(prevProgress => (prevProgress < 100 ? prevProgress + 1 : 100));
            }, 100);
        } else {
            clearInterval(interval);
            setProgress(0);
        }

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <div className={`loader-container ${loading ? 'visible' : ''}`}>
            <RingLoader color={'#69c5e9'} loading={loading} size={130} />
            <ProgressBar completed={progress}
                         isLabelVisible={false}
                         width={'200px'}
                         height={'10px'}
                         bgColor={'rgba(105,197,233,0.7)'}
                         baseBgColor={'#212121'}
                         margin={'70px 0px 0px 30px'}
                         transitionDuration={'0.1s'}
                         animateOnRender={true} />
        </div>
    );
};

export default InitLoader;
