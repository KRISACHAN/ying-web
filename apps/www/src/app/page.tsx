import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navigation from '@/components/Navigation';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import { defaultLocale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kris Chen | Resume',
    description:
        'Frontend Engineer with 8+ years of experience in web development',
};

// 使用 SSG 生成静态页面
export const revalidate = 86400; // 每天重新生成一次

export default async function RootPage() {
    // Directly use English as default locale
    const locale = defaultLocale;
    const dictionary = await getDictionary(locale);

    return (
        <main>
            <Navigation locale={locale} dictionary={dictionary} />
            <HeroSection locale={locale} dictionary={dictionary} />
            <AboutSection locale={locale} dictionary={dictionary} />
            <SkillsSection locale={locale} dictionary={dictionary} />
            <ExperienceSection locale={locale} dictionary={dictionary} />
            <ProjectsSection locale={locale} dictionary={dictionary} />
            <ContactSection locale={locale} dictionary={dictionary} />
            <Footer locale={locale} dictionary={dictionary} />
        </main>
    );
}
