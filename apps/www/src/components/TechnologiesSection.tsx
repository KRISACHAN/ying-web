import { Locale } from '@/types';

interface TechnologiesSectionProps {
    locale: Locale;
    dictionary: any;
}

export default function TechnologiesSection({
    locale,
    dictionary,
}: TechnologiesSectionProps) {
    const technologies = dictionary.technologies;

    return (
        <section id="technologies" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    {technologies.title}
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    {technologies.description}
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {technologies.categories.map(
                        (category: any, index: number) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.tools.map(
                                        (tool: string, toolIndex: number) => (
                                            <span
                                                key={toolIndex}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                {tool}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
