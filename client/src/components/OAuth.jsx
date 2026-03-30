import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      alert('Google button clicked!');
      console.log('Google click handler started');
      console.log('Firebase app:', app);
      if (!app) {
        throw new Error('Firebase app is not initialized');
      }
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      console.log('Auth initialized', !!auth);

      const result = await signInWithPopup(auth, provider);
      console.log('Firebase popup result:', result.user.email);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      console.log('Backend response status:', res.status);
      const data = await res.json();
      console.log('Backend data:', data);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
      alert('Error during Google sign-in: ' + error.message);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}
