import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Community from './pages/Community';
import Subscription from './pages/Subscription';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/community' element={<Community />} />
          <Route path='/subscription' element={<Subscription />} />
          <Route path='/pricing' element={<Subscription />} />
          <Route path='/listing/:listingId' element={<Listing />} />

          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/chat' element={<Chat />} />
            <Route
              path='/update-listing/:listingId'
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </div>
  );
}
