import {useState, type ChangeEvent} from 'react';

export function useForm<T>(initialState:T){
    const [values , setValues] = useState<T>(initialState);
    const handleChange =(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setValues((prev)=>({...prev,[name]:value}));
    };
    const resetForm =()=> setValues(initialState);
    return {values , handleChange, resetForm};
}