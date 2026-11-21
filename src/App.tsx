import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { HelpWelcomeBanner } from './components/common/HelpWelcomeBanner';
import { GoodbyeModal } from './components/common/GoodbyeModal';
import { SchoolThemeBanner } from './components/common/SchoolThemeBanner';
import { VillageContactView } from './components/common/VillageContactView';
import { AnimatedAsyvBackground } from './components/common/AnimatedAsyvBackground';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { WelcomeLandingPage } from './components/common/WelcomeLandingPage';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { ChatRoom } from './components/student/ChatRoom';
import { EmergencyModal } from './components/student/EmergencyModal';
import { JournalView } from './components/student/JournalView';
import { MoodTrackerView } from './components/student/MoodTrackerView';
import { AssessmentsView } from './components/student/AssessmentsView';
import { DailyQuestionView } from './components/student/DailyQuestionView';
import { TipsExplorerView } from './components/student/TipsExplorerView';
import { ChampionApplyView } from './components/student/ChampionApplyView';

// Social Worker Views
import { WorkerDashboard } from './components/social-worker/WorkerDashboard';
import { WorkerStudentsList } from './components/social-worker/WorkerStudentsList';
import { WorkerChat } from './components/social-worker/WorkerChat';
import { WorkerSosAlerts } from './components/social-worker/WorkerSosAlerts';
import { SetAssignmentModal } from './components/social-worker/SetAssignmentModal';
import { DailyQuestionSetter } from './components/social-worker/DailyQuestionSetter';
import { TodoList } from './components/social-worker/TodoList';
import { TimetableModal } from './components/social-worker/TimetableModal';
import { LessonPrepView } from './components/social-worker/LessonPrepView';
import { ChampionApproval } from './components/social-worker/ChampionApproval';
import { MonitorMyWorkerPage } from './components/social-worker/MonitorMyWorkerPage';

// Champion Hub & Dev Console
import { ChampionPortal } from './components/champion/ChampionPortal';
import { DevConsole } from './components/developer/DevConsole';
import { MentalHealthHub } from './components/wellbeing/MentalHealthHub';

import { Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activePage, isImpersonating, stopImpersonation } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');

  if (!currentUser) {
    return (
      <>
        {showAuthForm ? (
          <AuthModal
            initialTab={authInitialTab}
            onBackToWelcome={() => setShowAuthForm(false)}
          />
        ) : (
          <WelcomeLandingPage
            onEnterPortal={(tab) => {
              setAuthInitialTab(tab);
              setShowAuthForm(true);
            }}
          />
        )}
        <OfflineIndicator />
        <GoodbyeModal />
      </>
    );
  }

  const renderActiveView = () => {
    // Shared views across all roles
    if (activePage === 'wellbeing-hub') {
      return <MentalHealthHub />;
    }

    if (activePage === 'champion-portal') {
      return <ChampionPortal />;
    }

    if (activePage === 'contact-info') {
      return <VillageContactView />;
    }

    if (currentUser.role === 'student') {
      switch (activePage) {
        case 'dashboard': return <StudentDashboard />;
        case 'chat': return <ChatRoom />;
        case 'emergency': return <EmergencyModal />;
        case 'journal': return <JournalView />;
        case 'mood-tracker': return <MoodTrackerView />;
        case 'assessments': return <AssessmentsView />;
        case 'daily-question': return <DailyQuestionView />;
        case 'tips': return <TipsExplorerView />;
        case 'champion-apply': return <ChampionApplyView />;
        default: return <StudentDashboard />;
      }
    }

    if (currentUser.role === 'social_worker') {
      switch (activePage) {
        case 'dashboard': return <WorkerDashboard />;
        case 'monitor-my-worker': return <MonitorMyWorkerPage />;
        case 'students': return <WorkerStudentsList />;
        case 'chat': return <WorkerChat />;
        case 'sos-alerts': return <WorkerSosAlerts />;
        case 'assignments': return <SetAssignmentModal />;
        case 'daily-question': return <DailyQuestionSetter />;
        case 'todo': return <TodoList />;
        case 'timetable': return <TimetableModal />;
        case 'lessons': return <LessonPrepView />;
        case 'champion-apps': return <ChampionApproval />;
        default: return <WorkerDashboard />;
      }
    }

    if (currentUser.role === 'developer') {
      switch (activePage) {
        case 'dashboard': return <DevConsole />;
        case 'users': return <DevConsole />;
        case 'wellbeing-hub': return <MentalHealthHub />;
        case 'contact-info': return <VillageContactView />;
        case 'champion-apps': return <ChampionApproval />;
        default: return <DevConsole />;
      }
    }

    return <StudentDashboard />;
  };

  const isAdmin = currentUser.role === 'developer';

  return (
    <div className={`min-h-screen flex flex-col ${isAdmin ? 'text-slate-100' : 'text-slate-900 dark:text-slate-100'} transition-colors relative`}>
      {/* Moving Ambient ASYV Background: Admin gets executive command matrix; students get scenic landscape */}
      <AnimatedAsyvBackground variant={isAdmin ? 'admin' : 'full'} />

      {/* Impersonation / Admin Preview Mode Banner */}
      {isImpersonating && (
        <div className="bg-[#d95f18] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>Master Admin Preview Mode: Viewing Mind Bridge as {currentUser.name} {currentUser.familyName || ''} ({currentUser.role.replace('_', ' ')} · {currentUser.grade} Grade)</span>
          </div>
          <button
            onClick={stopImpersonation}
            className="px-3 py-1 bg-white text-[#d95f18] hover:bg-amber-100 rounded-lg text-xs font-extrabold cursor-pointer transition-colors shadow-xs"
          >
            Return to Master Admin Console
          </button>
        </div>
      )}

      {/* Mobile Drawer Toggle Banner */}
      <div className="lg:hidden bg-teal-800 text-white px-4 py-2 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 font-bold hover:text-teal-200 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Open Mind Bridge Menu</span>
        </button>
        <span className="font-semibold text-teal-200">{currentUser.grade} Grade</span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen relative z-10">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          {/* School Philosophy Motto on Every Tab for students/staff; DevConsole has its dedicated command header */}
          {!isAdmin && <SchoolThemeBanner />}

          {/* Welcome Prompt Check-in for students at every login */}
          <HelpWelcomeBanner />

          {/* Active Routed View */}
          {renderActiveView()}
        </main>

        <Footer />
      </div>

      <OfflineIndicator />
      <GoodbyeModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
