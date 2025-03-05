import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { FiBook, FiGithub, FiGlobe, FiMail } from 'react-icons/fi';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: '' });

  return {
    title: t('Contact'),
    description: t('Contact_Description'),
  };
}

export default function Contact({ params }: { params: { locale: string } }) {
  const t = useTranslations('');

  const contactLinks = [
    {
      icon: <FiMail className="w-8 h-8" />,
      title: t('Email'),
      value: 'chenjinwen77@gmail.com',
      link: 'mailto:chenjinwen77@gmail.com',
    },
    {
      icon: <FiGithub className="w-8 h-8" />,
      title: 'GitHub',
      value: 'KRISACHAN',
      link: 'https://github.com/KRISACHAN',
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: t('Personal_Website'),
      value: 'www.krissarea.com',
      link: 'https://www.krissarea.com',
    },
    {
      icon: <FiBook className="w-8 h-8" />,
      title: t('Tech_Blog'),
      value: 'blog.krissarea.com',
      link: 'https://blog.krissarea.com',
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header locale={params.locale} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10">{t('Contact_Me')}</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {contactLinks.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener"
                className="bg-card rounded-lg p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                <div className="text-primary">{item.icon}</div>
                <div>
                  <h2 className="font-medium text-xl">{item.title}</h2>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl font-medium mb-4">{t('Work_Opportunities')}</p>
            <p className="text-muted-foreground mb-6">{t('Currently_Looking')}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
