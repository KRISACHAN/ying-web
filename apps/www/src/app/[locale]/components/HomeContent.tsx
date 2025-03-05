'use client';

import { Link } from '@/src/navigation';
import { useTranslations } from 'next-intl';
import Button from './Button';

export default function HomeContent({ locale }: { locale: string }) {
    const t = useTranslations('');

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-24 px-6 text-center">
                    <div className="container mx-auto max-w-5xl">
                        <div className="mb-8">
                            <img
                                src="/profile.jpg"
                                alt="Kris Chen"
                                className="mx-auto h-48 w-48 rounded-full object-cover border-4 border-primary"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/150';
                                }}
                            />
                        </div>

                        <h1 className="text-5xl font-bold mb-6">Kris Chen</h1>
                        <h2 className="text-3xl font-medium text-muted-foreground mb-8">Frontend Engineer</h2>

                        <p className="text-xl mb-12 max-w-2xl mx-auto">
                            {t('Hero_Description') || 'Experienced frontend developer with 8 years of experience'}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/resume" locale={locale}>
                                <Button size="large">
                                    {t('View_Resume') || 'View Resume'}
                                </Button>
                            </Link>
                            <Link href="/about" locale={locale}>
                                <Button variant="secondary" size="large">
                                    {t('About_Me') || 'About Me'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">{t('Skills') || 'Skills'}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-card p-8 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">{t('Frontend_Technologies') || 'Frontend Technologies'}</h3>
                                <ul className="space-y-2">
                                    <li>Vue.js (2 & 3)</li>
                                    <li>React</li>
                                    <li>TypeScript</li>
                                    <li>{t('Frontend_Performance_Optimization') || 'Frontend Performance Optimization'}</li>
                                    <li>{t('Responsive_Design') || 'Responsive Design'}</li>
                                </ul>
                            </div>

                            <div className="bg-card p-8 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">{t('Backend_Technologies') || 'Backend Technologies'}</h3>
                                <ul className="space-y-2">
                                    <li>Node.js</li>
                                    <li>Koa.js</li>
                                    <li>BFF {t('Architecture') || 'Architecture'}</li>
                                    <li>RESTful API {t('Design') || 'Design'}</li>
                                </ul>
                            </div>

                            <div className="bg-card p-8 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">DevOps</h3>
                                <ul className="space-y-2">
                                    <li>Docker</li>
                                    <li>Kubernetes</li>
                                    <li>CI/CD</li>
                                    <li>{t('Monitoring') || 'Monitoring'} & {t('Alerting') || 'Alerting'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section Preview */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">{t('Featured_Projects') || 'Featured Projects'}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-card p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">ying-template</h3>
                                <p className="text-muted-foreground mb-4">{t('Project_Ying_Template_Description') || 'A ready-to-use frontend project template'}</p>
                                <a href="https://github.com/KRISACHAN/ying-template" target="_blank" rel="noopener" className="text-primary hover:underline">
                                    GitHub →
                                </a>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">ying-web</h3>
                                <p className="text-muted-foreground mb-4">{t('Project_Ying_Web_Description') || 'Full-stack project based on KoaJs + React'}</p>
                                <a href="https://github.com/KRISACHAN/ying-web" target="_blank" rel="noopener" className="text-primary hover:underline">
                                    GitHub →
                                </a>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link href="/resume#open-source-projects" locale={locale}>
                                <Button variant="secondary">{t('View_All_Projects') || 'View All Projects'}</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
