import HomePage from '@/components/pages/HomePage';
import MyLearningPage from '@/components/pages/MyLearningPage';
import ProgressPage from '@/components/pages/ProgressPage';
import CertificatesPage from '@/components/pages/CertificatesPage';
import NotesPage from '@/components/pages/NotesPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Browse Courses',
    path: '/',
    icon: 'Search',
    component: HomePage
  },
  myLearning: {
    id: 'myLearning',
    label: 'My Learning',
    path: '/my-learning',
    icon: 'BookOpen',
    component: MyLearningPage
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: ProgressPage
  },
  certificates: {
    id: 'certificates',
    label: 'Certificates',
    path: '/certificates',
    icon: 'Award',
    component: CertificatesPage
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    path: '/notes',
    icon: 'FileText',
    component: NotesPage
  }
};

export const routeArray = Object.values(routes);