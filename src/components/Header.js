import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constant";
import { toggleGptSearchView } from "../utils/gptSlice";
import lang from "../utils/languageConstant";
import { changeLanguage } from "../utils/configSlice";
const Header = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(store => store.user)
    const showGptSearch = useSelector(store => store.gpt.showGptSearch);
    //console.log(user);

    const handleSignOut = () =>{
        
        signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  navigate("/error")
});
    };
useEffect(()=>{
 const unsubscribe =     onAuthStateChanged( auth, (user) => {
  if (user) {
    
    const { uid ,email, displayName , photoURL} = user;
    dispatch(addUser({uid :uid, email: email, displayName : displayName, photoURL : photoURL}));
    navigate("/browse");
    

  } else {
    dispatch(removeUser());
    navigate("/");
   
  }
});

return () => unsubscribe();

},[])

 const handleGptSearchClick = () =>{
  dispatch(toggleGptSearchView());
 }

 const handleLanguageChange = (e) =>{
  dispatch(changeLanguage(e.target.value))
 }




    return (
    <div className="absolute w-screen px-8 pyp-2 bg-gradient-to-b from-black z-10 flex justify-between">
    <img className="w-44"
    src={LOGO}
    alt="logo">
    </img>

    {user && (<div className="flex p-2">
      {showGptSearch && (<select className="p-2 m-2 bg-gray-900 text-white rounded-lg" onChange={handleLanguageChange}>
        {SUPPORTED_LANGUAGES.map(lang => <option key={lang.identifer}value={lang.identifer}>{lang.name}</option>)}
      </select>)}
        <buttton onClick={handleGptSearchClick} className="py-2 px-4 mx-4 my-2 bg-purple-800 text-white rounded-lg">{showGptSearch ? "Home Page": "GPT Serach"}</buttton>
        <img className="w-12 h-12" alt ="usericon" src={user?.photoURL}></img>
        <button onClick={handleSignOut} className="font-bold text-white">Sign Out</button>
    </div>)
}
    </div>
    )
}

export default Header;