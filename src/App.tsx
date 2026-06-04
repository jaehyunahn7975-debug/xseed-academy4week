import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Globe, Compass, Zap, CheckCircle, Menu, X, MapPin, ExternalLink, Mail, Send, User, Phone, BookOpen, Building2 } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'intro', label: 'Intro' },
  { id: 'why', label: 'Why MIDAS' },
  {
    id: 'careers',
    label: 'Careers',
    children: [
      { id: 'careers', label: '모집공고' },
      { id: 'process', label: '전형안내' },
    ],
  },
  { id: 'cruise', label: 'Career Cruise' },
  { id: 'about', label: 'About' },
  { id: 'apply', label: 'Apply' },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type NavItem = { id: string; label: string; children?: { id: string; label: string }[] };

function Nav({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const allIds = ['intro', 'why', 'careers', 'process', 'step-task', 'step-assessment', 'cruise', 'step-coffeechat', 'step-final', 'about', 'apply'];
  const active = useActiveSection(allIds);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 60);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, [scrollRef]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const careersActive = active === 'careers' || active === 'process';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('intro')}
          className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-midas-navy' : 'text-white'
          }`}
        >
          MIDAS IT
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {(NAV_ITEMS as NavItem[]).map((item) => {
            if (item.children) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`nav-link animated-underline text-sm flex items-center gap-1 ${
                      scrolled
                        ? careersActive ? 'text-midas-sky' : 'text-gray-600 hover:text-midas-navy'
                        : careersActive ? 'text-midas-light' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollTo(child.id)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-midas-pale ${
                              active === child.id ? 'text-midas-sky bg-midas-pale/50' : 'text-gray-600'
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link animated-underline text-sm ${
                  scrolled
                    ? active === item.id ? 'text-midas-sky' : 'text-gray-600 hover:text-midas-navy'
                    : active === item.id ? 'text-midas-light' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => scrollTo('apply')}
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold bg-midas-sky text-white hover:bg-midas-blue transition-colors duration-300"
          >
            지원하기
          </button>
        </nav>

        <button
          className={`md:hidden transition-colors ${scrolled ? 'text-midas-navy' : 'text-white'}`}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex flex-col gap-1"
          >
            {(NAV_ITEMS as NavItem[]).map((item) => (
              item.children ? (
                <div key={item.id}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">{item.label}</p>
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => scrollTo(child.id)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm ${active === child.id ? 'text-midas-sky font-semibold' : 'text-gray-600'}`}
                    >
                      — {child.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`nav-link text-left px-2 py-2 ${active === item.id ? 'text-midas-sky' : 'text-gray-700'}`}
                >
                  {item.label}
                </button>
              )
            ))}
            <button
              onClick={() => scrollTo('apply')}
              className="mt-3 px-5 py-2 rounded-full text-sm font-semibold bg-midas-sky text-white w-fit"
            >
              지원하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="intro" ref={ref} className="snap-section relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Sail_videoSource.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20 md:mt-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
        >
          2026 MIDAS Global Recruitment
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-8"
        >
          <div>Raise your</div>
          <div className="mt-8 md:mt-12">
            Sail.
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="text-white/70 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          당신의 가능성에 바람을 더합니다.<br className="hidden sm:block" />
          마이다스아이티와 함께, 세계를 향해 항해를 시작하세요.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex justify-center mb-20"
        >
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 bg-white text-midas-navy font-bold rounded-full hover:bg-midas-pale transition-all duration-300 flex items-center justify-center gap-2"
          >
            지원하기 <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}

const WHY_ITEMS = [
  {
    icon: Globe,
    title: '140개국, 10만 명의 선택',
    subtitle: 'Global Reach',
    desc: '전 세계 140개국, 10만 명 이상의 엔지니어가 MIDAS 솔루션으로 세상을 설계합니다. 당신의 역할이 세계 인프라에 직접 닿습니다.',
  },
  {
    icon: Compass,
    title: '새로운 시장을 여는 기회',
    subtitle: 'New Frontier',
    desc: '기존 국내 중심의 사업 구조를 넘어 글로벌 시장에서 더 큰 성장을 만들어갑니다. 당신이 바로 그 첫 항해의 주역입니다.',
  },
  {
    icon: Zap,
    title: '성장형 인재를 위한 무대',
    subtitle: 'Growth Culture',
    desc: '완성된 역량보다 빠르게 배우고 실행하는 태도를 봅니다. 3개월 Global Customer Mirror Lab 온보딩으로 실전 역량을 키웁니다.',
  },
  {
    icon: CheckCircle,
    title: '사람 중심 경영',
    subtitle: 'People-First',
    desc: '사람 중심 경영을 바탕으로 한 HR 솔루션을 직접 만들고 경험합니다. 구성원의 성장이 회사의 성장입니다.',
  },
];

function WhySection() {
  return (
    <section id="why" className="snap-section section-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <p className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase mb-4">Why MIDAS IT</p>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            왜 지금, 마이다스인가
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            단순한 취업이 아닙니다.<br />
            글로벌 무대에서 고객의 문제를 직접 해결하는 사업개발 인재로 성장하는 기회입니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {WHY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeUp key={item.title} delay={i * 0.12}>
                <div className="group h-full p-8 lg:p-10 rounded-3xl border border-gray-100 bg-white hover:bg-midas-navy transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-default">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-midas-pale group-hover:bg-midas-sky/20 flex items-center justify-center transition-colors duration-500">
                      <Icon size={26} className="text-midas-sky group-hover:text-midas-light transition-colors duration-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-midas-sky group-hover:text-midas-light uppercase mb-1 transition-colors duration-500">
                        {item.subtitle}
                      </p>
                      <h3 className="text-xl font-bold text-midas-navy group-hover:text-white mb-3 transition-colors duration-500">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BENEFIT_GROUPS = [
  {
    category: '생활 지원',
    items: ['대졸 신입 계약연봉 4,400만 원 이상', 'M-포인트 제도', 'M-Lounge / M-Cafe 운영', '사내 미용실', '사내 복지시설'],
  },
  {
    category: '건강 지원',
    items: ['종합 건강검진', '전문가 심리상담', '피트니스룸'],
  },
  {
    category: '휴식 지원',
    items: ['수면실 운영', '콘도 회원권 지원'],
  },
  {
    category: '성장 지원',
    items: ['직무 및 제품 교육', '글로벌 사업 실무 경험', '현업 엔지니어와의 협업 기회', '멘토 피드백 및 온보딩 코칭', '3개월 Global Customer Mirror Lab'],
  },
];

const DUTIES = [
  '건설·엔지니어링 시장 조사 및 고객 발굴',
  '현지 고객 및 파트너사와의 비즈니스 커뮤니케이션',
  '글로벌 신규·기존 고객 대상 가치 제안 및 관계 확장',
  'MIDAS 엔지니어링 솔루션의 제품 가치 설명 및 제안',
  '고객 Pain Point 분석 및 맞춤형 제안 전략 수립',
  '온라인·오프라인 마케팅 및 세미나 기획·운영',
  '현업 엔지니어와 협업하여 고객 기술 문의 대응',
  '글로벌 시장 확산을 위한 영업 전략 및 실행 계획 수립',
];

const REQUIREMENTS = [
  '비즈니스 커뮤니케이션이 가능한 수준의 외국어 역량',
  '한국어 기반의 사내 소통 가능',
  '국적 무관, 본사 근무 가능',
  '낯선 시장과 고객을 이해하고 배우려는 태도',
  '기술 제품을 학습하고 고객의 언어로 설명하는 일에 관심',
  '스스로 문제를 찾고 실행해보려는 자세',
];

const PREFERRED = [
  '비즈니스 수준의 영어 역량',
  '토목·건축·구조·지반공학 등 관련 전공자',
  '건설·엔지니어링 또는 소프트웨어 산업 이해',
  '해외영업, 사업개발, B2B 영업, 마케팅 경험',
  '해외 유학, 교환학생, 현지 거주 경험',
];

function CareersSection() {
  const [tab, setTab] = useState<'duty' | 'req' | 'benefit'>('duty');

  return (
    <section id="careers" className="snap-section section-full bg-gray-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase">Careers</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400 text-sm">본사 근무 / 2026 하반기 글로벌 집중채용</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-4">
            글로벌 사업개발<br />담당자 채용
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            MIDAS의 기술과 가치를 글로벌 시장에 알리고, 현지 고객의 문제를 함께 해결하며,
            새로운 시장 기회를 만들어갈 성장형 인재를 찾습니다.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-12">
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['duty', 'req', 'benefit'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  tab === t
                    ? 'bg-midas-navy text-white shadow-md'
                    : 'bg-white text-gray-500 hover:bg-midas-pale hover:text-midas-navy border border-gray-200'
                }`}
              >
                {t === 'duty' ? '주요 업무' : t === 'req' ? '자격 요건' : '성장 지원 혜택'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'duty' && (
              <motion.div
                key="duty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {DUTIES.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-midas-sky/30 hover:shadow-sm transition-all duration-300">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-midas-sky/10 flex items-center justify-center text-midas-sky text-xs font-black">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{d}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === 'req' && (
              <motion.div
                key="req"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="bg-white rounded-3xl p-8 border border-gray-100">
                  <h3 className="font-black text-midas-navy text-lg mb-5">자격 요건</h3>
                  <ul className="space-y-3">
                    {REQUIREMENTS.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-midas-sky flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100">
                  <h3 className="font-black text-midas-navy text-lg mb-5">우대 조건</h3>
                  <ul className="space-y-3">
                    {PREFERRED.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-midas-light flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-midas-pale rounded-2xl">
                    <p className="text-xs text-midas-navy font-semibold mb-2">이런 분에게 잘 맞습니다</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      외국어를 고객 문제 해결에 활용하고 싶은 분 · 정해진 시장보다 새롭게 열어야 하는 시장에 흥미를 느끼는 분 · 단순 영업사원이 아닌 글로벌 사업개발 인재로 성장하고 싶은 분
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'benefit' && (
              <motion.div
                key="benefit"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {BENEFIT_GROUPS.map((group, i) => (
                  <div key={i} className="bg-white rounded-3xl p-7 border border-gray-100 hover:border-midas-sky/30 hover:shadow-md transition-all duration-300">
                    <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-4">{group.category}</p>
                    <ul className="space-y-2.5">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-midas-sky flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: '01',
    title: '지원서 접수 및 사전 과제 제출',
    subtitle: 'Application',
    date: '2026.09.02 ~ 09.13',
    sectionId: 'step-task',
    desc: '자기소개서 대신 가벼운 사전 과제를 제출합니다. MIDAS 솔루션을 확인한 뒤, 500자 내외로 고객 문제 해결 방안을 작성해주세요.',
  },
  {
    num: '02',
    title: '역량검사',
    subtitle: 'Assessment',
    date: '2026.09.02 ~ 09.13',
    sectionId: 'step-assessment',
    desc: '단순 스펙보다 사고 방식, 성향, 성장 가능성을 종합적으로 평가합니다. 합격자 발표: 2026.09.23',
  },
  {
    num: '03',
    title: 'Career Cruise',
    subtitle: 'One-Day Lounge',
    date: '2026.09.30',
    sectionId: 'cruise',
    desc: '지원자가 MIDAS를 직접 경험하고, 회사는 지원자의 글로벌 사업개발 잠재력을 미션과 행동을 통해 진단하는 원데이 채용 라운지입니다.',
  },
  {
    num: '04',
    title: 'Coffee Chat',
    subtitle: 'Final Interview',
    date: '2026.09.30',
    sectionId: 'step-coffeechat',
    desc: 'Career Cruise 당일 저녁, Career Cruise에서 수행한 미션과 피드백을 바탕으로 대화를 나눕니다.',
  },
  {
    num: '05',
    title: '최종 합격 발표',
    subtitle: 'Offer',
    date: '2026.10.07',
    sectionId: 'step-final',
    desc: '최종 합격자는 Career Cruise와 Coffee Chat 결과를 종합하여 선발합니다. 3개월 Global Customer Mirror Lab 온보딩이 시작됩니다.',
  },
];

function ProcessSection() {
  return (
    <section id="process" className="snap-section section-full bg-midas-navy py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <p className="text-midas-light text-sm font-semibold tracking-[0.25em] uppercase mb-4">Process</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            채용 프로세스
          </h2>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            스펙을 보지 않습니다. 당신이 어떻게 생각하고, 소통하고, 성장하는지를 봅니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.1}>
              <button
                onClick={() => document.getElementById(step.sectionId)?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative z-10 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-midas-sky/60 transition-all duration-300 h-full flex flex-col text-left w-full cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-midas-sky/20 border border-midas-sky/40 group-hover:bg-midas-sky/40 flex items-center justify-center text-midas-light font-black text-sm flex-shrink-0 transition-colors duration-300">
                    {step.num}
                  </span>
                  <span className="text-xs text-white/40 font-medium">{step.date}</span>
                </div>
                <p className="text-midas-light text-xs font-semibold tracking-wider uppercase mb-1">{step.subtitle}</p>
                <h3 className="text-white font-bold text-base mb-3 leading-snug">{step.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed flex-1">{step.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-midas-sky/60 group-hover:text-midas-sky text-xs font-semibold transition-colors duration-300">
                  자세히 보기 <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.6}>
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Mail size={16} className="text-midas-light flex-shrink-0" />
              <p className="text-white/60 text-sm">
                채용 관련 문의 :&nbsp;
                <a href="mailto:recruit@midasit.com" className="text-midas-light hover:underline">recruit@midasit.com</a>
                &nbsp;또는 마이다스아이티 채용 홈페이지 Q&A 메뉴를 이용해 주세요.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.7}>
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-10 py-5 bg-midas-sky text-white font-bold rounded-full text-lg hover:bg-midas-light transition-all duration-300 flex items-center gap-3 shadow-lg shadow-midas-sky/30"
            >
              지금 지원하기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function StepTaskSection() {
  return (
    <section id="step-task" className="snap-section section-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-midas-sky/10 border border-midas-sky/30 flex items-center justify-center text-midas-sky font-black text-sm">01</span>
            <span className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase">Application</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            지원서 접수 및<br />사전 과제 제출
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            자기소개서 대신, 가벼운 사전 과제를 제출합니다.<br />
            글쓰기 실력이 아닌, 회사와 직무를 이해하려는 태도를 봅니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <FadeUp delay={0.1}>
            <div className="h-full rounded-3xl overflow-hidden relative min-h-[400px]">
              <img
                src="/image.png"
                alt="MIDAS Square24 해외 다큐"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midas-navy/80 via-midas-navy/20 to-transparent" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <p className="text-midas-light text-xs font-semibold tracking-widest uppercase mb-2">MIDAS SQUARE24</p>
                <h3 className="text-white text-xl font-black mb-3">해외 다큐 영상</h3>
                <a
                  href="https://youtu.be/YZOFdZuopQw?si=2Ag4tl0T9_3yGNaL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-bold rounded-full transition-all duration-300 w-fit"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z"/></svg>
                  영상 보기
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-col gap-5">
            <div className="p-7 rounded-3xl bg-midas-pale border border-midas-sky/10">
              <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-3">사전 과제 안내</p>
              <h4 className="text-midas-navy font-black text-lg mb-3">예시 질문</h4>
              <div className="p-4 bg-white rounded-2xl border border-midas-sky/20 mb-4">
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "MIDAS의 기술이 베트남 건설·엔지니어링 고객의 어떤 문제를 해결할 수 있을지 작성해주세요."
                </p>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                500자 내외로 작성합니다. 정답을 찾는 것이 아닙니다.<br />
                고객의 문제를 바라보는 관점과 학습 가능성을 확인합니다.
              </p>
            </div>

            {[
              {
                step: 'STEP 1',
                title: '영상 시청',
                desc: '위 MIDAS SQUARE24 해외 다큐 영상을 먼저 확인하세요. MIDAS의 기술이 현지 고객에게 어떤 가치를 제공하는지 파악할 수 있습니다.',
              },
              {
                step: 'STEP 2',
                title: '홈페이지에서 지원',
                desc: '아래 지원하기 버튼을 통해 기본 정보를 입력하고 지원서를 접수합니다.',
              },
              {
                step: 'STEP 3',
                title: '메일로 안내받은 지원서 작성',
                desc: '지원 완료 후 안내 메일이 발송됩니다. 메일에 첨부된 지원서의 사전 과제 작성란에 해당 내용을 기입해 제출해 주세요.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-midas-sky/30 hover:shadow-sm transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-midas-sky/10 flex items-center justify-center text-midas-sky font-black text-xs">
                  {i + 1}
                </span>
                <div>
                  <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-0.5">{item.step}</p>
                  <h4 className="font-bold text-midas-navy text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 px-7 py-3.5 bg-midas-navy text-white font-bold rounded-full text-sm hover:bg-midas-blue transition-all duration-300"
              >
                지원하기 <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://youtu.be/YZOFdZuopQw?si=2Ag4tl0T9_3yGNaL"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-full text-sm hover:border-midas-sky hover:text-midas-sky transition-all duration-300"
              >
                영상 보기 <ExternalLink size={14} />
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function StepAssessmentSection() {
  return (
    <section id="step-assessment" className="snap-section section-full bg-gray-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-midas-sky/10 border border-midas-sky/30 flex items-center justify-center text-midas-sky font-black text-sm">02</span>
            <span className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase">Assessment</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            역량검사
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            스펙이 아닌 데이터로 판단합니다. 마이다스가 개발한 AI 역량검사로<br />
            당신의 사고 방식과 성장 가능성을 확인합니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <FadeUp delay={0.1} className="flex flex-col gap-5">
            <div className="p-8 rounded-3xl bg-white border border-gray-100">
              <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-3">잡다(JOBDA) AI 역량검사</p>
              <h3 className="text-midas-navy font-black text-xl mb-4">마이다스가 만든 채용 혁신</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                마이다스인이 개발한 잡다(JOBDA)의 AI 역량검사는 단순 스펙 평가를 넘어 뇌신경과학 기반의 설계로 지원자의 실제 문제 해결 방식과 행동 패턴을 분석합니다.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '자기보고식 검사', desc: '성향·가치관 분석' },
                  { label: '전략 게임', desc: '사고 방식·의사결정 패턴' },
                  { label: '영상 면접', desc: '소통·표현 역량' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-midas-pale rounded-2xl">
                    <p className="text-midas-navy font-bold text-xs mb-1">{item.label}</p>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-midas-navy">
              <p className="text-midas-light text-xs font-black tracking-widest uppercase mb-3">역량검사의 차별점</p>
              <div className="space-y-3">
                {[
                  { stat: '80%', desc: '고성과자 예측 정확도 (상관계수 0.51)' },
                  { stat: '81%', desc: '평가자 간 일치도 (기존 37% → 81%)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-2xl font-black text-midas-light">{item.stat}</span>
                    <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-col gap-5">
            <div className="h-full rounded-3xl overflow-hidden relative min-h-[360px]">
              <img
                src="https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="역량검사"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-midas-navy/85 to-midas-blue/60" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <p className="text-midas-light text-xs font-semibold tracking-widest uppercase mb-2">검사 기간</p>
                <h3 className="text-white text-2xl font-black mb-3">2026.09.02 ~ 09.13</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  지원서 접수 기간과 동일하게 진행됩니다.<br />합격자 발표는 <strong className="text-white">2026.09.23</strong>입니다.
                </p>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <p className="text-white/80 text-xs leading-relaxed">
                    결과에 정답은 없습니다. 평소 자신의 방식대로 자연스럽게 임하세요. 스펙보다 사고 방식, 성향, 성장 가능성을 종합적으로 봅니다.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function StepCoffeeChatSection() {
  return (
    <section id="step-coffeechat" className="snap-section section-full bg-gray-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-midas-sky/10 border border-midas-sky/30 flex items-center justify-center text-midas-sky font-black text-sm">04</span>
            <span className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase">Final Interview</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            Coffee Chat
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            압박 면접이 아닙니다. 데이터로 이미 검증된 인재와 조직이<br />
            서로의 방향성과 동기를 확인하는 시간입니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <FadeUp delay={0.1}>
            <div className="h-full rounded-3xl overflow-hidden relative min-h-[420px]">
              <img
                src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Coffee Chat"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-midas-navy/80 to-midas-blue/50" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <p className="text-midas-light text-xs font-semibold tracking-widest uppercase mb-2">Coffee Chat</p>
                <h3 className="text-white text-3xl font-black mb-3">2026.09.30</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Career Cruise 당일 저녁, 미션과 피드백을 바탕으로 편안하게 대화를 나눕니다.
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-col gap-5">
            <div className="p-7 rounded-3xl bg-white border border-gray-100">
              <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-4">이런 대화를 나눕니다</p>
              <div className="space-y-3">
                {[
                  '회사와 직무에 대한 이해도',
                  'MIDAS 글로벌 사업에 대한 관심도',
                  'Career Cruise 미션 수행 경험과 피드백 수용 태도',
                  '본인의 강점과 보완점에 대한 자기인식',
                  'MIDAS에서 성장하고 싶은 이유',
                  '조직과 함께 성과를 만들 수 있는 가능성',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-midas-sky flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-midas-pale border border-midas-sky/10">
              <p className="text-midas-sky text-xs font-black tracking-widest uppercase mb-3">Coffee Chat이란?</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                마이다스의 커피챗은 단순 면접 질문보다 Career Cruise에서 수행한 미션과 피드백을 바탕으로 대화를 나눕니다. 완성된 모습보다 솔직한 모습을 보여주세요. 지원자가 주도적으로 자신의 강점을 설명하고, 조직과 방향성이 맞는지를 함께 확인하는 자리입니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-midas-sky/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-midas-sky" />
                </div>
                <div>
                  <p className="text-midas-navy font-bold text-sm">면접 전 참고하세요</p>
                  <p className="text-gray-400 text-xs mt-0.5">Career Cruise에서 수행한 미션을 복기하고, 받은 피드백을 어떻게 반영했는지 생각해오세요.</p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function StepFinalSection() {
  return (
    <section id="step-final" className="snap-section section-full bg-midas-navy py-24 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #4A90D9 0%, transparent 55%), radial-gradient(circle at 80% 70%, #2A5FBD 0%, transparent 55%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-midas-sky/20 border border-midas-sky/40 flex items-center justify-center text-midas-light font-black text-sm">05</span>
            <span className="text-midas-light text-sm font-semibold tracking-[0.25em] uppercase">Offer</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            최종 합격 발표
          </h2>
          <p className="text-white/50 text-xl font-semibold">2026.10.07</p>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white text-3xl md:text-4xl font-black leading-snug mb-6">
                당신의 항해가<br />지금 시작됩니다.
              </h3>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                최종 합격자는 Career Cruise와 Coffee Chat 결과를 종합하여 선발합니다. 합격 이후에는 3개월 Global Customer Mirror Lab 온보딩을 통해 고객 문제 이해, 제품 가치 설명, 현업 피드백 반영, CSR 기반 성찰을 경험하며 글로벌 사업개발 인재로 성장하게 됩니다.
              </p>
              <div className="space-y-3">
                {[
                  '고객 문제 이해 및 현장 실무 경험',
                  '제품 가치 설명 역량 개발',
                  '현업 엔지니어와의 협업 및 피드백 반영',
                  'CSR 기반 성찰과 성장 루틴 형성',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={15} className="text-midas-light flex-shrink-0" />
                    <p className="text-white/70 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <button
                onClick={() => document.getElementById('mirror-voyage')?.scrollIntoView({ behavior: 'smooth' })}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 hover:border-midas-sky/40 transition-all duration-300 w-full"
              >
                <p className="text-midas-light text-xs font-black tracking-widest uppercase mb-3">90-Day Onboarding Program</p>
                <h4 className="text-white text-2xl font-black mb-1">MIRROR VOYAGE</h4>
                <h4 className="text-midas-light text-lg font-black mb-4">90-Day Treasure Map</h4>
                <p className="text-white/50 text-xs leading-relaxed mb-4">
                  가능성을 비추고, 성장을 밀어주는 90일 온보딩 여정. Career Cruise가 끝난 뒤, 진짜 항해가 시작됩니다.
                </p>
                <div className="flex items-center justify-center gap-2 text-midas-sky text-xs font-semibold group-hover:text-midas-light transition-colors duration-300">
                  자세히 보기 <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '직무 교육', sub: '제품·기술 학습' },
                  { label: '멘토 코칭', sub: '1:1 온보딩 피드백' },
                  { label: '현업 협업', sub: '엔지니어와 함께' },
                  { label: 'CSR 성찰', sub: '매일 성찰·회고' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors duration-300">
                    <p className="text-white font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-white/40 text-xs">{item.sub}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full py-4 bg-midas-sky text-white font-bold rounded-full hover:bg-midas-light transition-all duration-300 flex items-center justify-center gap-2"
              >
                지금 지원하기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function MirrorVoyageSection() {
  const onboardingSteps = [
    { label: '진단', desc: 'Career Cruise에서 확인된\n강점·보완점 정리' },
    { label: '진단 기록', desc: '채용 과정 결과를\n온보딩 시작점으로 연결' },
    { label: '90일 과제', desc: '고객 문제 이해부터\n재실행까지 반복 수행' },
    { label: '성장 리뷰', desc: '90일 성장 결과를\n바탕으로 앞으로의 실행 계획 발표' },
  ];

  const cycleSteps = [
    { label: '고객 문제 이해', color: 'bg-midas-sky text-white' },
    { label: '작은 실행', color: 'bg-midas-blue text-white' },
    { label: '현업 피드백', color: 'bg-midas-navy text-white' },
    { label: '성찰', color: 'bg-slate-700 text-white' },
    { label: '재실행', color: 'bg-midas-sky text-white' },
  ];

  const months = [
    {
      num: '01',
      phase: '방향 이해 단계',
      keywords: ['회사·제품·고객·시장 이해', '나의 성장 방향 파악', '강점과 보완점 확인'],
    },
    {
      num: '02',
      phase: '고객가치 설계 단계',
      keywords: ['고객 문제 이해·정리', '기술을 고객가치 언어로 전환', '작은 실행 과제 수행 및 피드백'],
    },
    {
      num: '03',
      phase: '현업 연결 단계',
      keywords: ['실제 업무 흐름과 연결', '현업 관점 실행 경험', '피드백 반영 → 개선안·다음 액션 제시'],
    },
  ];

  return (
    <section id="mirror-voyage" className="snap-section section-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* 헤더 */}
        <FadeUp>
          <p className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase mb-4">90-Day Onboarding Program</p>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-2">
            MIRROR VOYAGE
          </h2>
          <h3 className="text-2xl md:text-3xl font-black text-midas-sky mb-6">90-Day Treasure Map</h3>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            채용의 완성은 온보딩이다.
          </p>
        </FadeUp>

        {/* 상단: 온보딩 프로세스 4단계 */}
        <FadeUp delay={0.1} className="mt-14">
          <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-5">Onboarding Process</p>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {onboardingSteps.map((step, i) => (
              <div key={i} className="flex flex-1 items-stretch">
                <div className={`flex-1 rounded-2xl p-6 flex flex-col gap-2 border transition-all duration-300 ${i === 2 ? 'bg-midas-navy border-midas-navy' : 'bg-white border-gray-100 hover:border-midas-sky/30 hover:shadow-sm'}`}>
                  <span className={`text-xs font-black tracking-widest uppercase ${i === 2 ? 'text-midas-light' : 'text-midas-sky'}`}>
                    Step {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className={`font-black text-base ${i === 2 ? 'text-white' : 'text-midas-navy'}`}>{step.label}</h4>
                  <p className={`text-xs leading-relaxed whitespace-pre-line ${i === 2 ? 'text-white/60' : 'text-gray-400'}`}>{step.desc}</p>
                  {i === 2 && (
                    <span className="mt-1 text-midas-light text-xs font-semibold">↓ 아래에서 자세히</span>
                  )}
                </div>
                {i < onboardingSteps.length - 1 && (
                  <div className="flex items-center justify-center px-2 sm:px-1 flex-shrink-0">
                    <ArrowRight size={16} className="text-midas-sky/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 구분선 */}
        <FadeUp delay={0.2} className="mt-14 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-xs font-black tracking-widest text-gray-400 uppercase whitespace-nowrap">90일 과제 운영 원리</p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        </FadeUp>

        {/* 하단: 90일 과제 운영 사이클 */}
        <FadeUp delay={0.25}>
          <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 md:p-10 mb-8">
            <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">반복 실행 사이클</p>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {cycleSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-black ${s.color}`}>{s.label}</span>
                  {i < cycleSteps.length - 1 && (
                    <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3">
                <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                <span className="px-4 py-2 rounded-full text-sm font-black border-2 border-dashed border-midas-sky/40 text-midas-sky">반복</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-4 leading-relaxed">
              90일 과제는 한 번의 학습으로 끝나지 않습니다. 고객 문제를 이해하고 실행하며, 현업 피드백을 받아 성찰하고 다시 실행하는 반복 사이클로 운영됩니다.
            </p>
          </div>
        </FadeUp>

        {/* 월별 단계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {months.map((m, i) => (
            <FadeUp key={m.num} delay={0.3 + i * 0.1}>
              <div className="h-full rounded-2xl border border-gray-100 bg-white hover:border-midas-sky/30 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                <div className="px-7 pt-7 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-midas-sky/10 flex items-center justify-center text-midas-sky font-black text-sm flex-shrink-0">{m.num}</span>
                    <span className="text-gray-400 text-xs font-semibold">{m.num === '01' ? 'Month 1' : m.num === '02' ? 'Month 2' : 'Month 3'}</span>
                  </div>
                  <h4 className="text-midas-navy font-black text-base">{m.phase}</h4>
                </div>
                <div className="px-7 py-5 flex-1">
                  <ul className="space-y-2.5">
                    {m.keywords.map((kw, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-midas-sky flex-shrink-0 mt-1.5" />
                        <span className="text-gray-600 text-sm">{kw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}

function CruiseSection() {
  return (
    <section id="cruise" className="snap-section section-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <p className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase mb-4">Career Cruise</p>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            가벼운 마음으로<br />MIDAS를 만나는 시간
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Career Cruise는 단순한 면접이나 채용 설명회가 아닙니다.<br />
            지원자와 MIDAS가 서로를 더 잘 알아가는 즐거운 항해입니다.
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <FadeUp delay={0.1}>
            <div className="h-full rounded-3xl overflow-hidden relative min-h-[400px]">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Career Cruise"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-midas-navy/80 to-midas-blue/60" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <p className="text-midas-light text-xs font-semibold tracking-widest uppercase mb-3">One-Day Recruitment Lounge</p>
                <h3 className="text-white text-3xl font-black mb-4">Career Cruise</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  완성된 영업 실력을 요구하지 않습니다. 처음 접하는 제품과 시장 앞에서 어떻게 이해하고, 소통하고, 협업하고, 피드백을 반영하는지를 봅니다.
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-col gap-5">
            {[
              {
                title: 'MIDAS를 직접 경험',
                desc: '일하는 방식과 문화를 직접 체험합니다. 정답 같은 모습보다 자연스러운 모습을 보여주세요.',
              },
              {
                title: '미션 기반 진단',
                desc: '처음 만나는 제품과 시장을 어떻게 이해하고, 사람들과 어떻게 소통하며, 함께 문제를 풀어가는지를 확인합니다.',
              },
              {
                title: 'Coffee Chat',
                desc: 'Career Cruise 당일 저녁, Career Cruise에서 수행한 미션과 피드백을 바탕으로 편안하게 대화를 나눕니다.',
              },
              {
                title: '3개월 온보딩 연계',
                desc: '합격 후 Global Customer Mirror Lab 온보딩을 통해 고객 문제 이해, 제품 가치 설명, CSR 기반 성찰을 경험합니다.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-midas-sky/30 hover:shadow-sm transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-midas-sky/10 flex items-center justify-center text-midas-sky font-black text-xs">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-bold text-midas-navy text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </FadeUp>
        </div>

        <FadeUp delay={0.4} className="mt-16">
          <div className="rounded-3xl bg-midas-pale border border-midas-sky/10 p-8 md:p-10">
            <p className="text-midas-sky text-sm font-semibold tracking-wider uppercase mb-5">지원 전, 스스로에게 질문해보세요</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                '나는 글로벌 영업 고객 문제 해결에 외국어를 활용하고 싶은가?',
                '나는 기술 제품을 배우고 고객이 이해할 수 있는 언어로 설명할 준비가 되어 있는가?',
                '나는 낯선 시장에서 첫 고객, 첫 미팅, 첫 기회를 만들어보고 싶은가?',
                '나는 피드백을 받고 내 생각을 수정하며 성장할 수 있는가?',
                '나는 왜 MIDAS에서 글로벌 사업개발 인재로 성장하고 싶은가?',
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-midas-sky font-black text-sm flex-shrink-0">Q{i + 1}.</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

const CULTURE_ITEMS = [
  {
    name: '행복나침반',
    subtitle: '전 세계 구성원과 함께하는',
    desc: '전 그룹사의 경영 현황과 비전을 투명하게 공유하며 구성원 모두가 같은 목표를 향해 나아가는 시간.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: '마이다스 히어로즈데이',
    subtitle: '위대한 성과를 위한 축제',
    desc: '전 세계 사업 담당자들이 하나로 모여 서로를 격려하고 우리의 여정을 자축하는 날. 여기, 당신이 주인공입니다.',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: '엑스퍼츠데이',
    subtitle: '기술과 혁신의 순간을 나누는',
    desc: '우리의 최첨단 기술과 성과물을 모두와 나누는 특별한 날. 이곳에서 가능성은 경계를 초월합니다.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: '비전데이',
    subtitle: '미래를 꿈꾸고 공감하는',
    desc: '전 세계 마이다스 구성원이 모두 한자리에 모여 더 나은 내일을 상상하는 시간. 그 미래는 우리가 함께 만듭니다.',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const TALENT_TYPES = [
  {
    en: 'Frontier',
    ko: '개척자',
    desc: '아무도 먼저 가지 않은 시장에서도 첫 고객, 첫 미팅, 첫 파트너를 만들어 내는 사람',
  },
  {
    en: 'Translator',
    ko: '번역가',
    desc: 'MIDAS의 기술을 고객의 문제와 성과 언어로 바꾸어 설명하는 사람',
  },
  {
    en: 'Igniter',
    ko: '점화자',
    desc: '작은 시장 기회를 발견하고, 이를 고객 확산과 매출 성장으로 키우는 사람',
  },
];

function AboutSection() {
  return (
    <section id="about" className="snap-section section-full bg-gray-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <p className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase mb-4">About MIDAS</p>
          <h2 className="text-4xl md:text-6xl font-black text-midas-navy leading-tight mb-6">
            우리가 찾는<br />인재상
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed mb-4">
            글로벌 사업개발 성장형 인재
          </p>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            "낯선 시장과 고객을 두려워하지 않고, 빠르게 학습하며, MIDAS의 기술을 글로벌 고객의 문제와 가치로 연결할 수 있는 사람"
          </p>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TALENT_TYPES.map((t, i) => (
            <FadeUp key={t.en} delay={i * 0.12}>
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:bg-midas-navy hover:border-midas-navy transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-default h-full">
                <p className="text-xs font-black tracking-widest text-midas-sky group-hover:text-midas-light uppercase mb-2 transition-colors duration-500">{t.en}</p>
                <h3 className="text-2xl font-black text-midas-navy group-hover:text-white mb-4 transition-colors duration-500">{t.ko}</h3>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-500">{t.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3} className="mt-20">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-midas-sky text-sm font-semibold tracking-[0.25em] uppercase mb-2">Culture</p>
              <h3 className="text-3xl font-black text-midas-navy">좋은 나를 만드는 좋은 문화</h3>
            </div>
            <a
              href="https://group.midasit.com/culture"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-midas-sky text-midas-sky font-bold text-sm hover:bg-midas-sky hover:text-white transition-all duration-300"
            >
              문화 더 보기 <ExternalLink size={15} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CULTURE_ITEMS.map((c, i) => (
              <FadeUp key={c.name} delay={0.35 + i * 0.1}>
                <div className="group rounded-3xl overflow-hidden relative h-60 cursor-default">
                  <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midas-navy/90 via-midas-navy/30 to-transparent" />
                  <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                    <p className="text-white/60 text-xs mb-1">{c.subtitle}</p>
                    <h4 className="text-white font-black text-base mb-2">{c.name}</h4>
                    <p className="text-white/60 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">{c.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.5} className="mt-14">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-10 rounded-3xl bg-white border border-gray-100">
            <div className="text-center sm:text-left">
              <p className="text-midas-navy font-black text-xl mb-1">MIDAS Group 홈페이지</p>
              <p className="text-gray-400 text-sm">마이다스의 기술, 사람, 문화를 더 깊이 알아보세요.</p>
            </div>
            <a
              href="https://group.midasit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-midas-navy text-white font-bold rounded-full hover:bg-midas-blue transition-all duration-300"
            >
              홈페이지 방문 <ExternalLink size={16} />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

type ApplicationStatus = 'idle' | 'submitting' | 'success';

function ApplySection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', nationality: '', language: '', message: '' });
  const [status, setStatus] = useState<ApplicationStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-midas-sky/40 focus:border-midas-sky transition-all duration-200 placeholder-gray-300";

  return (
    <section id="apply" className="snap-section section-full bg-midas-navy py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeUp>
            <p className="text-midas-light text-sm font-semibold tracking-[0.25em] uppercase mb-4">Apply</p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              지원하기
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              지원서를 접수하면 담당자가 검토 후 연락드립니다.<br />
              기본적인 정보만 입력해 주세요.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <MapPin size={20} className="text-midas-light flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">근무 위치</p>
                  <p className="text-white/50 text-xs mt-0.5">본사 근무 (성남시 분당구)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <BookOpen size={20} className="text-midas-light flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">채용 공고</p>
                  <p className="text-white/50 text-xs mt-0.5">2026 하반기 글로벌 집중채용</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <Building2 size={20} className="text-midas-light flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">채용 직무</p>
                  <p className="text-white/50 text-xs mt-0.5">글로벌 사업개발 담당자</p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-midas-sky/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-midas-sky" />
                </div>
                <h3 className="text-midas-navy font-black text-2xl mb-3">지원이 완료되었습니다</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  담당자가 검토 후 입력하신 이메일로 연락드리겠습니다.
                </p>
                <p className="text-gray-400 text-xs">채용 문의: recruit@midasit.com</p>
                <div className="mt-8 p-5 rounded-2xl bg-midas-pale">
                  <p className="text-midas-navy text-sm font-semibold mb-2">전형 진행 단계</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {['접수 완료', '서류 검토', '역량검사', 'Career Cruise', '최종 합격'].map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-midas-sky text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {i + 1}
                        </div>
                        <span className="hidden sm:block text-center">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이름 *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">국적</label>
                    <input
                      type="text"
                      placeholder="대한민국"
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이메일 *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      required
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">연락처</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">가능한 외국어</label>
                  <input
                    type="text"
                    placeholder="예: 영어 (비즈니스), 베트남어 (일상)"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">간단한 지원 동기 (선택)</label>
                  <textarea
                    rows={3}
                    placeholder="MIDAS에서 이루고 싶은 것을 자유롭게 적어주세요."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-midas-navy text-white font-bold rounded-xl hover:bg-midas-blue transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      처리 중...
                    </>
                  ) : (
                    <>지원서 제출하기 <Send size={15} /></>
                  )}
                </button>
                <p className="text-gray-300 text-xs text-center">
                  접수 후 담당자가 직접 연락드립니다 · recruit@midasit.com
                </p>
              </form>
            )}
          </FadeUp>
        </div>

        <footer className="mt-20 border-t border-white/10 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white font-bold text-lg">MIDAS IT</p>
            <p className="text-white/30 text-sm text-center">
              © 2026 MIDAS Information Technology. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-white/30">
              <a href="https://group.midasit.com/" target="_blank" rel="noopener noreferrer" className="hover:text-midas-light transition-colors">홈페이지</a>
              <a href="mailto:recruit@midasit.com" className="hover:text-midas-light transition-colors">채용 문의</a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="snap-container">
      <Nav scrollRef={scrollRef} />
      <HeroSection />
      <WhySection />
      <CareersSection />
      <ProcessSection />
      <StepTaskSection />
      <StepAssessmentSection />
      <CruiseSection />
      <StepCoffeeChatSection />
      <StepFinalSection />
      <MirrorVoyageSection />
      <AboutSection />
      <ApplySection />
    </div>
  );
}
