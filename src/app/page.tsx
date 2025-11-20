'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Enterprise LMS + ERP + CRM Platform',
      subtitle: 'Empowering learners in Sudan and worldwide with adaptive, AI-powered education',
      features: [
        'Adaptive Learning with AI Tutoring',
        'Bilingual Support (Arabic & English)',
        'Secure Certificate Verification',
        'Comprehensive CRM for Students, Donors & Instructors',
        'Special Support for Orphans & Special Needs',
        'Offline-First Mobile Experience',
      ],
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      login: 'Login',
      register: 'Register',
    },
    ar: {
      title: 'منصة إدارة التعلم والموارد وعلاقات العملاء',
      subtitle: 'تمكين المتعلمين في السودان والعالم بالتعليم الذكي والتكيفي',
      features: [
        'التعلم التكيفي مع التدريس بالذكاء الاصطناعي',
        'دعم ثنائي اللغة (العربية والإنجليزية)',
        'التحقق الآمن من الشهادات',
        'إدارة شاملة للطلاب والمتبرعين والمدرسين',
        'دعم خاص للأيتام وذوي الاحتياجات الخاصة',
        'تجربة متنقلة تعمل بدون اتصال',
      ],
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
    },
  };

  const t = content[language as keyof typeof content];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">EduPlatform</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
              {t.login}
            </Link>
            <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              {t.register}
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {t.features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Start Your Learning Journey' : 'ابدأ رحلة التعلم الخاصة بك'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'en'
                  ? 'Join thousands of learners worldwide. Access quality education, earn verified certificates, and build your future.'
                  : 'انضم إلى آلاف المتعلمين حول العالم. احصل على تعليم عالي الجودة، واكسب شهادات موثقة، وابنِ مستقبلك.'}
              </p>
              <div className="flex gap-4">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  {t.getStarted}
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
                >
                  {t.learnMore}
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl h-64 flex items-center justify-center text-white text-6xl">
              🎓
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600">10K+</div>
            <div className="text-gray-600 mt-2">{language === 'en' ? 'Students' : 'طالب'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-600 mt-2">{language === 'en' ? 'Courses' : 'دورة'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">100+</div>
            <div className="text-gray-600 mt-2">{language === 'en' ? 'Instructors' : 'مدرس'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">50+</div>
            <div className="text-gray-600 mt-2">{language === 'en' ? 'Countries' : 'دولة'}</div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 EduPlatform. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
        </div>
      </footer>
    </div>
  );
}
