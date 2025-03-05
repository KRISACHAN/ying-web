import { getTranslations } from 'next-intl/server';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: '' });

  return {
    title: t('About_Me'),
    description: t('About_Me_Description'),
  };
}

export default function About({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header locale={params.locale} />

      <main className="container mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <img
              src="/banner.jpg"
              alt="Kris"
              className="mx-auto mb-6 rounded-lg max-h-72 object-cover w-full"
            />
            <h1 className="text-4xl font-bold mb-2">About Me</h1>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a href="https://github.com/KRISACHAN" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-md hover:bg-muted transition-colors">
                <span>GitHub: KRISACHAN</span>
              </a>
              <a href="mailto:chenjinwen77@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-md hover:bg-muted transition-colors">
                <span>Email: chenjinwen77@gmail.com</span>
              </a>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-md">
                <span>WeChat: krisChans95</span>
              </div>
            </div>
          </div>

          <p>Hello there!</p>

          <p>I'm Kris, a front-end developer from China with 8 years of experience.</p>

          <p>I consider myself an optimistic and positive person.</p>

          <p>Previously, I was an employee focused solely on work achievements.</p>

          <p>But then, one day out of the blue, I decided to change my life.</p>

          <p>The truth is, we only live once, so we should live the life we desire, not the one others expect of us.</p>

          <p>So, I quit my job and am preparing to be a remote worker. (Perhaps I'll become a freelancer who doesn't just code all day. Who knows?)</p>

          <p>The reason? I want to strike a work-life balance.</p>

          <p>I think it's super cool to do what I love (like traveling or taking care of my family) while working.</p>

          <p>It might be a tough goal, but I believe I can pull it off.</p>

          <p>Even if it takes a long time or I fail, I won't give up.</p>

          <p>I'll keep moving forward on this path and never look back.</p>

          <p>As a risk-taker, I'm not scared of any challenges.</p>

          <p className="font-medium">Love,</p>

          <p className="font-medium">Kris</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
