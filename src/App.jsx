import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import CourseDetailPage from '@/components/pages/CourseDetailPage';
import LearningPage from '@/components/pages/LearningPage';
import MyLearningPage from '@/components/pages/MyLearningPage';
import ProgressPage from '@/components/pages/ProgressPage';
import CertificatesPage from '@/components/pages/CertificatesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/learning/:courseId" element={<LearningPage />} />
            <Route path="/learning/:courseId/:lessonId" element={<LearningPage />} />
            <Route path="/my-learning" element={<MyLearningPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="*" element={<NotFoundPage />} />
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