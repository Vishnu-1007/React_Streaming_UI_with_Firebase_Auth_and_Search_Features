import { useRef, useState } from "react";
import Header from "./Header";
import  { checkValidData } from "../utils/validate";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR } from "../utils/constant";
import { BG_URL } from "../utils/constant";

const Login = () => {
    
        const[isSignInForm, setIsSignInForm] = useState(true)

        const [errorMessage, setErrorMessage] = useState(null);

       

        const dispatch = useDispatch();

        const name = useRef(null);

        const email = useRef(null);

        const password = useRef(null);

        
        //console.log(email.current.value, password.current.value)
        
        const handleButtonClick = () =>{

        const message =  checkValidData(email.current.value, password.current.value);
        //console.log(message);

        setErrorMessage(message);

        if (message) return;

        if(!isSignInForm){
          createUserWithEmailAndPassword(auth, email.current.value, password.current.value, name.current.value)
         .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    updateProfile(user, {
  displayName: name.current.value, photoURL: USER_AVATAR
}).then(() => {
  const { uid ,email, displayName , photoURL} = auth.currentUser;
      dispatch(addUser({uid :uid, email: email, displayName : displayName, photoURL : photoURL}));
 
}).catch((error) => {
  setErrorMessage(error.message);
});
    //console.log(user);

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode+"-"+errorMessage);
    // ..
  });

        } else{
     signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    //console.log(user);
 
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode+"-"+errorMessage);
  });
        }

        }

        const toggleSignInForm = ()=>{
            setIsSignInForm(!isSignInForm)
        }

      return (
    <div>
      <Header />
      <div className=" absolute">
        <img
          src= {BG_URL}
          alt="logo"
        ></img>
      </div>
      <form onSubmit={(e) =>{e.preventDefault()}} className="w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-70">
      <h1 className="font-bold text-3xl">{isSignInForm ? "SignIn" : "SignUp"}</h1> 

        {!isSignInForm  && (<input ref={name} type="text" placeholder="First Name" className="p-4 my-4 w-full bg-gray-900"></input>)}

        <input type="text" ref={email} placeholder="Email" className="p-4 my-4 w-full bg-gray-900"></input>
        <input type="password" ref={password} placeholder="Password" className="p-4 my-4 w-full bg-gray-900"></input>
        <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
        <button onClick={handleButtonClick} className="p-4 my-6 bg-red-700 w-full rounded-lg">{isSignInForm ? "SignIn" : "SignUp"}</button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>{isSignInForm ? "New to Netflix? Sign Up Now" : "Already registerd Sign In"}</p>
      </form>
    </div>
  );
};

export default Login;
