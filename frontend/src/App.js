import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PhotoList } from "./components/PhotoList";
import { Upload } from "./components/Upload";
import { Post } from "./components/Post";
import { Registration } from './components/Registration';
import { Myprofile } from './components/Myprofile';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Album } from './components/Album';
import { PageLayout } from './components/PageLayout';

// function App() {
//   return (
//     <div className="page">
//       <Router>
//         <Routes>

//           <Route
//             path="/upload"
//             element={
//               <>
//                 <Header />
//                 <Upload className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route
//             path="/my"
//             element={
//               <>
//                 <Header />
//                 <Myprofile className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route
//             path="/album/:idAlbum"
//             element={
//               <>
//                 <Header />
//                 <Album className="content"/>
//                 <Footer />
//               </>
//             }
//           />
//           <Route
//             path="/user/:user_id"
//             element={
//               <>
//                 <Header />
//                 <Profile className="content"/>
//                 <Footer />
//               </>
//             }
//           />
          
//           <Route
//             path="/post/:idPost"
//             element={
//               <>
//                 <Header />
//                 <Post className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route
//             path="/search/:tags"
//             element={
//               <>
//                 <Header />
//                 <PhotoList className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route
//             path="/search/"
//             element={
//               <>
//                 <Header />
//                 <PhotoList className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route
//             path="/"
//             element={
//               <>
//                 <Header />
//                 <PhotoList className="content"/>
//                 <Footer />
//               </>
//             }
//           />

//           <Route path="/login" element={<Login />} />

//           <Route path="/registration" element={<Registration />} />

//         </Routes>
//       </Router>
//     </div>
//   );
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLayout><PhotoList /></PageLayout>} />
        <Route path="/upload" element={<PageLayout><Upload /></PageLayout>} />
        <Route path="/my" element={<PageLayout><Myprofile /></PageLayout>} />
        <Route path="/album/:idAlbum" element={<PageLayout><Album /></PageLayout>} />
        <Route path="/user/:user_id" element={<PageLayout><Profile /></PageLayout>} />
        <Route path="/post/:idPost" element={<PageLayout><Post /></PageLayout>} />
        <Route path="/search/:tags" element={<PageLayout><PhotoList /></PageLayout>} />
        <Route path="/search/" element={<PageLayout><PhotoList /></PageLayout>} />

        {/* Страницы без футера/хедера */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
