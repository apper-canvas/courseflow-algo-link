import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/organisms/AppHeader';

function Layout() {
return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;