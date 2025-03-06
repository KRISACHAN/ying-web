import { SOCIAL_LINKS } from '@/lib/constants';
import { Locale } from '@/types';
import Image from 'next/image';

type HeroSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function HeroSection({ dictionary }: HeroSectionProps) {
    const hero = dictionary.hero;

    return (
        <section className="pt-24 pb-12 md:py-32 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <div className="rounded-full w-48 h-48 mx-auto md:mx-0 overflow-hidden border-4 border-white shadow-xl relative group">
                        {/* Profile image */}
                        <Image
                            src="/me.jpg"
                            alt={hero.name}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                        />
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                </div>
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center md:justify-start">
                        <i className="fas fa-code text-blue-200 mr-3"></i>
                        {hero.name}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium mb-6 text-blue-100 flex items-center justify-center md:justify-start">
                        <i className="fas fa-laptop-code text-blue-200 mr-2"></i>
                        {hero.title}
                    </h2>
                    <p className="text-lg max-w-lg mx-auto md:mx-0">
                        {hero.description}
                    </p>
                    <div className="mt-8 space-x-4">
                        <a
                            href="#contact"
                            className="inline-block bg-white text-blue-600 font-medium py-3 px-6 rounded-full shadow-md hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <i className="fas fa-paper-plane mr-2"></i>
                            {hero.contactButton}
                        </a>
                        <a
                            href="#projects"
                            className="inline-block bg-transparent border-2 border-white text-white font-medium py-3 px-6 rounded-full hover:bg-white/10 transition transform hover:-translate-y-1"
                        >
                            <i className="fas fa-project-diagram mr-2"></i>
                            {hero.projectsButton}
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="mt-6 flex space-x-4 justify-center md:justify-start">
                        {SOCIAL_LINKS.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 flex items-center justify-center text-white hover:text-blue-100 transition bg-white/10 p-3 rounded-full hover:bg-white/20"
                                title={link.title}
                            >
                                <i className={`${link.icon} text-xl`}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
