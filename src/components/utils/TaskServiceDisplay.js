import React from 'react';
import { RingLoader } from 'react-spinners';
import '../../css/loader.css';

const TaskServiceDisplay = ({ task, loading }) => {

    return (
      <div className="horizontal-container">
        <div className={`small-loader${loading ? '-visible' : ''}`}>
            <RingLoader color={'#69c5e9'} size={20} />
        </div>
        <div className="displayed-task-text">
          {task}
        </div>
      </div>
    );
};

export default TaskServiceDisplay;
