import { getTranslations } from 'next-intl/server';
import HomeContent from './components/HomeContent';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: '' });

  return {
    title: 'Kris Chen - Frontend Engineer',
    description: 'Personal website of Kris Chen',
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  // Return the client component with the locale prop
  return <HomeContent locale={locale} />;
}
