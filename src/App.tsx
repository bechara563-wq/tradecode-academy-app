import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { MarketProvider } from './context/MarketContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { AuthModal } from './components/AuthModal.js';
import { HomeView } from './views/HomeView.js';
import { CoursesView } from './views/CoursesView.js';
import { CourseDetailView } from './views/CourseDetailView.js';
import { LessonDetailView } from './views/LessonDetailView.js';
import { MarketsView } from './views/MarketsView.js';
import { NewsView } from './views/NewsView.js';
import { ResourcesView } from './views/ResourcesView.js';
import { PricingView } from './views/PricingView.js';
import { StudentDashboardView } from './views/StudentDashboardView.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';
import { AboutView } from './views/AboutView.js';
import { Course } from './types/index.js';
import { TrendingUp, BookOpen, User, Shield, Home, MessageCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [initialTrackFilter, setInitialTrackFilter] = useState<any>('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [courses, setCourses] = useState<Course[]>([]);

  const loadCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data || []);
      }
    } catch (e) {
      console.error('Failed to load courses:', e);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleNavigate = (view: string, param?: any) => {
    if (view === 'course-detail' && typeof param === 'string') {
      setActiveCourseId(param);
    } else if (view === 'lesson-detail' && typeof param === 'string') {
      setActiveLessonId(param);
    } else if (view === 'courses' && param?.track) {
      setInitialTrackFilter(param.track);
    } else {
      setInitialTrackFilter('all');
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300 pb-16 md:pb-0">
      {/* Top Navbar with live ticker */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            courses={courses}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'courses' && (
          <CoursesView
            courses={courses}
            initialTrack={initialTrackFilter}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'course-detail' && activeCourseId && (
          <CourseDetailView
            courseId={activeCourseId}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'lesson-detail' && activeLessonId && (
          <LessonDetailView
            lessonId={activeLessonId}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'markets' && <MarketsView />}

        {currentView === 'news' && <NewsView />}

        {currentView === 'resources' && <ResourcesView />}

        {currentView === 'pricing' && (
          <PricingView
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboardView
            courses={courses}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            courses={courses}
            onRefreshCourses={loadCourses}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <aside aria-label="تواصل واتساب" className="fixed bottom-20 md:bottom-6 left-5 z-40">
        <a
          href="https://wa.me/22248885937"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/40 transition transform hover:scale-105 active:scale-95 group"
          title="تواصل معنا عبر واتساب: 48885937"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="font-mono">واتساب: 48885937</span>
        </a>
      </aside>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar (Optimized for Android) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around text-[10px]">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition ${
            currentView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => handleNavigate('courses')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition ${
            currentView === 'courses' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>الدورات</span>
        </button>

        <button
          onClick={() => handleNavigate('markets')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition ${
            currentView === 'markets' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>الأسواق</span>
        </button>

        <button
          onClick={() => user ? handleNavigate('student') : handleOpenAuth('login')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition ${
            currentView === 'student' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span>حسابي</span>
        </button>

        {user?.role === 'admin' && (
          <button
            onClick={() => handleNavigate('admin')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition ${
              currentView === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-500/80 hover:text-amber-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>الإدارة</span>
          </button>
        )}
      </nav>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <MainApp />
      </MarketProvider>
    </AuthProvider>
  );
}
