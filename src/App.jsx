import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Learning from './pages/Learning';
import MyLearning from './pages/MyLearning';
import Progress from './pages/Progress';
import Certificates from './pages/Certificates';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/learning/:courseId" element={<Learning />} />
            <Route path="/learning/:courseId/:lessonId" element={<Learning />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;