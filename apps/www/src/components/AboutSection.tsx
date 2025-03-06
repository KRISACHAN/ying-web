import { Locale } from '@/types';

type AboutSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function AboutSection({ dictionary }: AboutSectionProps) {
    const about = dictionary.about;

    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                    {about.title}
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4"></span>
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                        <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                            <i className="fas fa-lightbulb text-yellow-500 mr-3"></i>
                            {about.philosophy.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            {about.philosophy.description}
                        </p>
                    </div>

                    <div className="md:w-1/2">
                        <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                            <i className="fas fa-award text-blue-500 mr-3"></i>
                            {about.strengths.title}
                        </h3>
                        <div className="space-y-4">
                            {about.strengths.items.map(
                                (item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        <h4 className="font-bold text-gray-800 flex items-center">
                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-700 mt-2">
                                            {item.description}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
