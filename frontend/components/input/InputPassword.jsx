"use client";

import { useState } from "react";

const InputPassword = ({ value, onChange=null, id=null, label=true }) => {
    
    const [valueLocal, setValueLocal] = useState("");
    const [eye, setEye] = useState('password');

    const setValueLocalHandler = (val) => {
        if(!onChange){
            setValueLocal(val);
        } else {
            onChange(val)
        }
    }

    const eyeHandler = () => {
        if(eye === 'password'){
            setEye('text');
        } else  {
            setEye('password')
        }
    }


    return (
        <div className="flex flex-col mt-4 relative">
            {label && (
                <label htmlFor={id ?? 'password'} className="text-sm text-gray-500">
                    Password
                </label>
            )}
            <input
                id={id ?? 'password'}
                name={id ?? 'password'}
                type={eye}
                className="border focus:outline-oreoles-orange/50 rounded-sm py-1 px-2"
                autoComplete="current-password"
                value={value ?? valueLocal}
                onChange={(e) => setValueLocalHandler(e.target.value)}
            />
            <span className={`absolute right-2 ${label ? 'top-6' : 'top-1' } cursor-pointer text-gray-500 hover:text-flame`}
                onClick={eyeHandler}>
                    <i className="bi bi-eye"></i>
                </span>
        </div>
        
    )
}

export default InputPassword;
