import { Locale } from '@/types';

type ProjectsSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function ProjectsSection({ dictionary }: ProjectsSectionProps) {
    const projects = dictionary.projects;

    const defaultGradients = [
        'from-blue-400 to-indigo-500',
        'from-green-400 to-teal-500',
        'from-purple-400 to-pink-500',
    ];

    const defaultBadgeColors = [
        { bg: 'bg-blue-100', text: 'text-blue-800' },
        { bg: 'bg-green-100', text: 'text-green-800' },
        { bg: 'bg-purple-100', text: 'text-purple-800' },
    ];

    return (
        <section id="projects" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                    {projects.title}
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.items.map((project: any, idx: number) => {
                        const gradient =
                            project.gradient ||
                            defaultGradients[idx % defaultGradients.length];
                        const badgeColor =
                            project.badgeColor ||
                            defaultBadgeColors[idx % defaultBadgeColors.length];

                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div
                                    className={`h-48 bg-gradient-to-r ${gradient} flex items-center justify-center p-4 text-center`}
                                >
                                    <h3 className="text-2xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                        {project.title}
                                    </h3>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold truncate mr-2">
                                            {project.title}
                                        </h3>
                                        <span
                                            className={`${badgeColor.bg} ${badgeColor.text} text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0`}
                                        >
                                            {project.stars}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-4">
                                        {project.description}
                                    </p>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            {projects.technologiesLabel ||
                                                'Technologies:'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map(
                                                (tech: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:underline"
                                    >
                                        {projects.viewOnGithub ||
                                            'View on GitHub'}
                                        <svg
                                            className="w-5 h-5 ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* See More Projects Button */}
                {projects.moreUrl && (
                    <div className="text-center mt-12">
                        <a
                            href={projects.moreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            {projects.viewMore}{' '}
                            <i className="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
