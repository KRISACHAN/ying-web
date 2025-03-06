import { Locale } from '@/types';

type ExperienceSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function ExperienceSection({
    dictionary,
}: ExperienceSectionProps) {
    const experience = dictionary.experience;

    return (
        <section id="experience" className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                    {experience.title}
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4"></span>
                </h2>

                <div className="relative border-l-4 border-blue-500 pl-8 space-y-12 mx-auto">
                    {/* Timeline Items */}
                    {experience.jobs.map((job: any, idx: number) => (
                        <div key={idx} className="relative">
                            <div className="absolute -left-12 mt-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <i className="fas fa-briefcase text-white"></i>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {job.company}
                                </h3>
                                <p className="text-blue-600 font-medium">
                                    {job.position}{' '}
                                    <span className="text-gray-500">
                                        | {job.period}
                                    </span>
                                </p>

                                {job.description && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">
                                            {job.description}
                                        </p>
                                    </div>
                                )}

                                {job.projects && job.projects.length > 0 && (
                                    <div className="mt-4 space-y-6">
                                        {job.projects.map(
                                            (
                                                project: any,
                                                projectIdx: number,
                                            ) => (
                                                <div
                                                    key={projectIdx}
                                                    className="bg-gray-50 p-4 rounded-lg"
                                                >
                                                    <h4 className="font-bold text-gray-800">
                                                        {project.title}
                                                    </h4>
                                                    <p className="text-gray-600 text-sm mb-3">
                                                        {project.description}
                                                    </p>
                                                    {project.achievements && (
                                                        <ul className="text-gray-700 list-disc pl-5 space-y-1">
                                                            {project.achievements.map(
                                                                (
                                                                    item: string,
                                                                    i: number,
                                                                ) => (
                                                                    <li key={i}>
                                                                        {item}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                                {job.achievements &&
                                    job.achievements.length > 0 &&
                                    !job.projects && (
                                        <ul className="mt-4 list-disc pl-5 text-gray-600 space-y-1">
                                            {job.achievements.map(
                                                (item: string, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
