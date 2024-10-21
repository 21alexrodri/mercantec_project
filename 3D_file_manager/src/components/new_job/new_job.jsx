import { useCallback, useState, useEffect } from "react";
import "./new_job.css"

export const NewJob = ({closeNewJob})=>{

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    return(
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="main">
                        <div>
                            
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}