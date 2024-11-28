import Markdown from 'react-markdown';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { config } from '@/config';
import { signOgImageUrl } from '@/lib/og-image';

const content = `# About Me

> * Github: [https://github.com/KRISACHAN](https://github.com/KRISACHAN)
> * Email: [chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
> * WeChat: krisChans95

![Kris](/banner.jpg)

Hello there!

I'm Kris, a front-end developer from China with 8 years of experience.

I consider myself an optimistic and positive person.

Previously, I was an employee focused solely on work achievements.

But then, one day out of the blue, I decided to change my life.

The truth is, we only live once, so we should live the life we desire, not the one others expect of us.

So, I quit my job and am preparing to be a remote worker. (Perhaps I'll become a freelancer who doesn't just code all day. Who knows?)

The reason? I want to strike a work-life balance.

I think it's super cool to do what I love (like traveling or taking care of my family) while working.

It might be a tough goal, but I believe I can pull it off.

Even if it takes a long time or I fail, I won't give up.

I'll keep moving forward on this path and never look back.

As a risk-taker, I'm not scared of any challenges.

Love,

Kris`;

export async function generateMetadata() {
    return {
        title: 'About Me',
        description: 'Something about Kris and his life',
        openGraph: {
            title: 'About Me',
            description: 'Something about Kris and his life',
            images: [
                signOgImageUrl({
                    title: 'Kris',
                    label: 'About Me',
                    brand: config.blog.name,
                }),
            ],
        },
    };
}

const Page = async () => {
    return (
        <div className="container mx-auto px-5">
            <Header />
            <div className="prose lg:prose-lg dark:prose-invert m-auto mt-20 mb-10 blog-content">
                <Markdown>{content}</Markdown>
            </div>
            <Footer />
        </div>
    );
};

export default Page;
