import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Gift, Zap, Trophy, Gamepad2, Star, ArrowRight, LogIn, ChevronRight, Sparkles, Globe, ChevronDown } from 'lucide-react';

// 1. Comprehensive Translation Dictionary
const translations = {
  en: {
    nav: { links: ['Home', 'Offers', 'Rewards', 'FAQ'], login: 'Login' },
    hero: {
      badge: 'Free RP & Rewards Platform',
      title1: 'Earn Free',
      title2: 'League of Legends RP',
      desc: 'Complete quick tasks, view custom offers, and instantly claim your Riot Points.',
      btnEarn: 'Start Earning Now',
      btnWorks: 'How It Works',
      statUsers: 'Active Users',
      statClaimed: 'RP Claimed'
    },
    features: {
      heading: 'Why Choose',
      subheading: 'The hyper-optimized ecosystem crafted for instant skin unlock generation.',
      items: [
        { title: 'Earn RP Fast', desc: 'Complete quick tasks and offers to earn up to 3.250 RP daily.' },
        { title: 'Safe & Secure', desc: 'We are affiliated with Riot Games, Inc. and operate within their guidelines.' },
        { title: 'Instant Delivery', desc: 'Everything is fully automated. RP delivers instantly onto your account after completing offers.' },
        { title: 'Premium Offers', desc: 'Gain prioritized entry into premium campaign walls yielding maximum RP rewards.' },
        { title: 'Global Regions', desc: 'We are scaling across NA, EUW, EUNE, KR.' },
        { title: 'Tactical Support', desc: 'Dedicated operational support standing by 24/7 for you.' }
      ]
    },
    howItWorks: {
      heading: 'How It',
      span: 'Works',
      subheading: 'In depth blueprint',
      steps: [
        { number: '01', title: 'Login', desc: 'Login with your account.' },
        { number: '02', title: 'Choose an Offer', desc: 'Choose to complete a task from the list.' },
        { number: '03', title: 'Complete Tasks', desc: 'Complete the task (10-20 minutes).' },
        { number: '04', title: 'Get Your RP', desc: 'Upon task completion, the RP will be added to your account.' }
      ]
    },
    cta: {
      title1: 'Ready to Claim',
      title2: 'Free RP?',
      desc: 'Join 10.000+ players who are already earning free Riot Points and rewards with LeagueAwards.lol. Start your journey today!',
      btn: 'Get Started Free'
    },
    footer: {
      affiliation: 'LeagueAwards.lol is currently affiliated with Riot Games, Inc.',
      col1: 'Quick Links',
      col2: 'Support Channels',
      rights: 'All rights reserved.'
    }
  },
  pl: {
    nav: { links: ['Główna', 'Oferty', 'Nagrody', 'FAQ'], login: 'Zaloguj się' },
    hero: {
      badge: 'Darmowa Platforma RP i Nagród',
      title1: 'Zarabiaj Darmowe',
      title2: 'Riot Points do LoL-a',
      desc: 'Wykonuj szybkie zadania, przeglądaj dedykowane oferty i natychmiast odbieraj swoje Riot Points.',
      btnEarn: 'Zacznij Zarabiać',
      btnWorks: 'Jak to Działa',
      statUsers: 'Aktywni Gracze',
      statClaimed: 'Odebrane RP'
    },
    features: {
      heading: 'Dlaczego Warto Wybrać',
      subheading: 'Zoptymalizowany ekosystem stworzony do błyskawicznego powiększania kolekcji skórek.',
      items: [
        { title: 'Szybkie Zarabianie', desc: 'Wykonuj krótkie misje i oferty, aby zgarnąć do 3.250 RP każdego dnia.' },
        { title: 'Bezpieczeństwo', desc: 'Współpracujemy z Riot Games, Inc. i działamy ściśle według ich oficjalnych wytycznych.' },
        { title: 'Natychmiastowa Dostawa', desc: 'Pełna automatyzacja. RP trafia bezpośrednio na Twoje konto od razu po zaliczeniu zadania.' },
        { title: 'Oferty Premium', desc: 'Zyskaj priorytetowy dostęp do paneli sponsorskich oferujących maksymalne stawki punktowe.' },
        { title: 'Globalne Regiony', desc: 'W pełni wspieramy i obsługujemy serwery NA, EUW, EUNE oraz KR.' },
        { title: 'Wsparcie Taktyczne', desc: 'Nasz dedykowany zespół techniczny czuwa i pomaga przez całą dobę, 7 dni w tygodniu.' }
      ]
    },
    howItWorks: {
      heading: 'Jak To',
      span: 'Działa',
      subheading: 'Instrukcja krok po kroku',
      steps: [
        { number: '01', title: 'Zaloguj się', desc: 'Zaloguj się bezpiecznie za pomocą swojego unikalnego profilu.' },
        { number: '02', title: 'Wybierz Ofertę', desc: 'Wybierz jedno z dostępnych zadań wyświetlonych na interaktywnej liście.' },
        { number: '03', title: 'Wykonaj Zadanie', desc: 'Sfinalizuj wytyczne wybranej misji (zajmuje to około 10-20 minut).' },
        { number: '04', title: 'Odbierz RP', desc: 'Po pomyślnej weryfikacji zadania, punkty RP są z miejsca dopisywane do konta.' }
      ]
    },
    cta: {
      title1: 'Gotowy na Odbiór',
      title2: 'Darmowych RP?',
      desc: 'Dołącz do ponad 10 000 graczy, którzy gromadzą darmowe Riot Points razem z LeagueAwards.lol. Zacznij już dziś!',
      btn: 'Dołącz Za Darmo'
    },
    footer: {
      affiliation: 'Strona LeagueAwards.lol jest aktualnie powiązana z firmą Riot Games, Inc.',
      col1: 'Szybkie Linki',
      col2: 'Kanały Pomocy',
      rights: 'Wszelkie prawa zastrzeżone.'
    }
  },
  sr: {
    nav: { links: ['Početna', 'Ponude', 'Nagrade', 'FAQ'], login: 'Prijava' },
    hero: {
      badge: 'Besplatna RP & Nagradna Platforma',
      title1: 'Zaradi Besplatan',
      title2: 'League of Legends RP',
      desc: 'Završi brze zadatke, pogledaj prilagođene ponude i momentalno preuzmi svoje Riot Poene.',
      btnEarn: 'Započni Zaradu',
      btnWorks: 'Kako Radi',
      statUsers: 'Aktivni Korisnici',
      statClaimed: 'Preuzeto RP-a'
    },
    features: {
      heading: 'Zašto Izabrati',
      subheading: 'Hiper-optimizovan ekosistem skrojen za instant generisanje i otključavanje skinova.',
      items: [
        { title: 'Brza Zarada RP-a', desc: 'Ispunite jednostavne zadatke i ponude da zaradite i do 3.250 RP-a dnevno.' },
        { title: 'Sigurno & Bezbedno', desc: 'Povezani smo sa Riot Games, Inc. i radimo striktno u okviru njihovih smernica.' },
        { title: 'Instant Dostava', desc: 'Sve je potpuno automatizovano. RP stiže direktno na tvoj nalog odmah nakon završetka ponude.' },
        { title: 'Premium Ponude', desc: 'Ostvari prioritetan pristup premium zadacima koji donose maksimalne RP nagrade.' },
        { title: 'Globalni Regioni', desc: 'Sistem nesmetano podržava i pokriva NA, EUW, EUNE i KR servere.' },
        { title: 'Podrška', desc: 'Podrška ti je na raspolaganju 24 sata dnevno, 7 dana u nedelji.' }
      ]
    },
    howItWorks: {
      heading: 'Kako',
      span: 'Radi?',
      subheading: 'Detaljan plan rada',
      steps: [
        { number: '01', title: 'Prijava', desc: 'Prijavi se bezbedno na svoj korisnički nalog.' },
        { number: '02', title: 'Izaberi Ponudu', desc: 'Izaberi i pokreni željeni zadatak sa ponuđene liste.' },
        { number: '03', title: 'Završi Zadatak', desc: 'Ispuni zahteve izabrane misije (traje svega 10-20 minuta).' },
        { number: '04', title: 'Preuzmi RP', desc: 'Nakon verifikacije uspešnog završetka, RP se automatski dodaje na tvoj nalog.' }
      ]
    },
    cta: {
      title1: 'Spreman da Uzmeš',
      title2: 'Besplatan RP?',
      desc: 'Pridruži se grupi od preko 10.000 igrača koji već uveliko zarađuju besplatne Riot Poene na LeagueAwards.lol. Počni odmah!',
      btn: 'Započni Besplatno'
    },
    footer: {
      affiliation: 'LeagueAwards.lol je trenutno povezan sa kompanijom Riot Games, Inc.',
      col1: 'Brzi Linkovi',
      col2: 'Kanali Podrške',
      rights: 'Sva prava zadržana.'
    }
  }
};

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sr', name: 'Srpski', flag: '🇷🇸' }
];

const LanguageSelector = ({ currentLang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedLang = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-200 hover:text-white hover:border-fuchsia-500/40 transition-all text-sm font-semibold tracking-wide"
      >
        <Globe className="w-4 h-4 text-fuchsia-400" />
        <span>{selectedLang.flag} {selectedLang.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0d041f]/95 border border-fuchsia-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLang(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  currentLang === lang.code 
                    ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 text-fuchsia-400 border-l-2 border-fuchsia-500' 
                    : 'text-purple-200/70 hover:bg-purple-900/20 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ t, currentLang, setLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#090214]/85 backdrop-blur-xl border-b border-fuchsia-500/20 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.1)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-700 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)] group-hover:rotate-6 transition-transform duration-300">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">League</span>
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">Awards</span>
            <span className="text-fuchsia-500 font-medium lowercase">.lol</span>
          </span>
        </div>

        <div className="flex items-center gap-6 lg:gap-8">
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {t.nav.links.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-semibold tracking-wide uppercase text-purple-200/60 hover:text-fuchsia-400 transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-fuchsia-500 after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector currentLang={currentLang} setLang={setLang} />
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              {t.nav.login}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ t }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#06010f]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,10,54,0.6),#06010f)]" />
      <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[130px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1235_1px,transparent_1px),linear-gradient(to_bottom,#1f1235_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-24">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-fuchsia-950/30 border border-fuchsia-500/30 rounded-full mb-8 shadow-[0_0_15px_rgba(217,70,239,0.1)] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-300">{t.hero.badge}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 uppercase">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {t.hero.title1}
          </span>
          <br />
          <span className="text-white relative inline-block drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {t.hero.title2}
          </span>
        </h1>
        <p className="text-purple-200/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          {t.hero.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-1">
            {t.hero.btnEarn}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-purple-950/20 border border-purple-500/30 hover:border-fuchsia-500/60 text-purple-200 hover:text-white font-bold tracking-wider uppercase rounded-xl transition-all duration-300 backdrop-blur-sm hover:-translate-y-1">
            {t.hero.btnWorks}
          </button>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-4 max-w-2xl mx-auto border border-purple-500/10 p-6 rounded-2xl bg-[#0b031a]/45 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="text-center border-r border-purple-500/10">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400">10K+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400/60 mt-1">{t.hero.statUsers}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-400">150K+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-fuchsia-400/60 mt-1">{t.hero.statClaimed}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = ({ t }) => {
  const icons = [Gift, Shield, Zap, Trophy, Gamepad2, Star];

  return (
    <section className="py-28 px-6 bg-[#090214] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#05010d)]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            {t.features.heading} <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">LeagueAwards</span>
          </h2>
          <p className="text-purple-300/60 font-medium max-w-xl mx-auto text-lg">
            {t.features.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, i) => {
            const IconComponent = icons[i] || Star;
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-gradient-to-b from-purple-950/10 to-purple-950/30 border border-purple-900/30 hover:border-fuchsia-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-950 to-fuchsia-950/60 border border-purple-500/20 group-hover:border-fuchsia-500/50 flex items-center justify-center mb-6 transition-colors shadow-inner">
                  <IconComponent className="w-5 h-5 text-purple-400 group-hover:text-fuchsia-400 group-hover:scale-110 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-sm text-purple-200/60 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = ({ t }) => {
  return (
    <section className="py-28 px-6 bg-[#05010d] relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            {t.howItWorks.heading} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{t.howItWorks.span}</span>
          </h2>
          <p className="text-purple-300/60 font-medium max-w-xl mx-auto text-lg">
            {t.howItWorks.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.howItWorks.steps.map((step, index) => (
            <div key={step.number} className="relative text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/20 group-hover:border-fuchsia-500/50 flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{step.title}</h3>
              <p className="text-sm text-purple-200/60 leading-relaxed px-2 font-medium">{step.desc}</p>
              
              {index < 3 && (
                <div className="hidden lg:block absolute top-8 left-[65%] w-[70%] h-[2px] bg-gradient-to-r from-purple-500/20 via-fuchsia-500/40 to-transparent z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ t }) => (
  <section className="py-28 px-6 bg-[#090214] relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.1),transparent_60%)]" />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-b from-[#120727]/60 to-[#090214]/90 border border-fuchsia-500/20 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          {t.cta.title1} <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-400">{t.cta.title2}</span>
        </h2>
        <p className="text-purple-200/60 text-lg mb-10 max-w-lg mx-auto font-medium">
          {t.cta.desc}
        </p>
        <button className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-0.5">
          {t.cta.btn}
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  </section>
);

const Footer = ({ t }) => (
  <footer className="border-t border-purple-500/10 py-16 px-6 bg-[#05010d] relative z-10">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg uppercase tracking-wider">
              <span className="text-fuchsia-400">League</span>
              <span className="text-white">Awards</span>
              <span className="text-fuchsia-500 lowercase font-medium">.lol</span>
            </span>
          </div>
          <p className="text-sm text-purple-300/40 max-w-sm leading-relaxed font-medium">
            {t.footer.affiliation}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-4">{t.footer.col1}</h4>
          <ul className="space-y-3">
            {t.nav.links.map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-purple-300/60 hover:text-white font-medium transition-colors duration-200">{link}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">{t.footer.col2}</h4>
          <ul className="space-y-3">
            {['Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-purple-300/60 hover:text-white font-medium transition-colors duration-200">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-500/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-purple-300/30">&copy; {new Date().getFullYear()} LeagueAwards.lol. {t.footer.rights}</p>
      </div>
    </div>
  </footer>
);

const Homepage = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#06010f] text-white antialiased selection:bg-fuchsia-500 selection:text-white font-sans">
      <Navbar t={t} currentLang={lang} setLang={setLang} />
      <HeroSection t={t} />
      <FeaturesSection t={t} />
      <HowItWorksSection t={t} />
      <CTASection t={t} />
      <Footer t={t} />
    </div>
  );
};

export default Homepage;