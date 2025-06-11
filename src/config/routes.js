import Home from '../pages/Home';
import MyLearning from '../pages/MyLearning';
import Progress from '../pages/Progress';
import Certificates from '../pages/Certificates';

export const routes = {
  home: {
    id: 'home',
    label: 'Browse Courses',
    path: '/',
    icon: 'Search',
    component: Home
  },
  myLearning: {
    id: 'myLearning',
    label: 'My Learning',
    path: '/my-learning',
    icon: 'BookOpen',
    component: MyLearning
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  certificates: {
    id: 'certificates',
    label: 'Certificates',
    path: '/certificates',
    icon: 'Award',
    component: Certificates
  }
};

export const routeArray = Object.values(routes);