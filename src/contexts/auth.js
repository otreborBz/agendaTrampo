import React, {createContext, useState, useEffect} from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/service/firebaseConnection';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState('carregando...');

    useEffect(()=>{
        async function feacthUser(){
            const docRef = doc(db, "appointments", "xi8m11tony0HZbkJJI76");
            await getDoc(docRef)
            .then((snapshot) =>{
                setUser(snapshot.data());
            })
            .catch((error) => {
                console.log("Erro ao buscar usuário:", error);
            });
            
        }
        feacthUser();
    },[])


    return(
        <AuthContext.Provider value={{user}}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;

