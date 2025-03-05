import { getTranslations } from 'next-intl/server';
import Markdown from 'react-markdown';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

async function getResumeContent(locale: string) {
  try {
    // Load the appropriate resume content based on locale
    if (locale === 'zh') {
      return (await import('@/messages/zh-resume.md')).default;
    } else {
      return (await import('@/messages/en-resume.md')).default;
    }
  } catch (error) {
    console.error('Error loading resume content:', error);
    return '# Resume content not available';
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: '' });

  return {
    title: t('Resume'),
    description: t('Professional_resume_of_Kris_Chen'),
  };
}

export default async function ResumePage({ params }: { params: { locale: string } }) {
  const content = await getResumeContent(params.locale);

  return (
    <div className="min-h-screen bg-background">
      <Header locale={params.locale} />

      <main className="container mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
          <Markdown>{content}</Markdown>
        </div>
      </main>

      <Footer />
    </div>
  );
}
