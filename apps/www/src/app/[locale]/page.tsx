import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navigation from '@/components/Navigation';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/types';

type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const dictionary = await getDictionary(locale as Locale);

    return (
        <main>
            <Navigation locale={locale as Locale} dictionary={dictionary} />
            <HeroSection locale={locale as Locale} dictionary={dictionary} />
            <AboutSection locale={locale as Locale} dictionary={dictionary} />
            <SkillsSection locale={locale as Locale} dictionary={dictionary} />
            <ExperienceSection
                locale={locale as Locale}
                dictionary={dictionary}
            />
            <ProjectsSection
                locale={locale as Locale}
                dictionary={dictionary}
            />
            <ContactSection locale={locale as Locale} dictionary={dictionary} />
            <Footer locale={locale as Locale} dictionary={dictionary} />
        </main>
    );
}
