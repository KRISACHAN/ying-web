import { Locale } from '@/types';

type SkillsSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function SkillsSection({ dictionary }: SkillsSectionProps) {
    const skills = dictionary.skills;

    const getFrontendSkills = () => {
        if (Array.isArray(skills.frontend)) {
            return skills.frontend;
        }
        return skills.frontend.items || [];
    };

    const getBackendSkills = () => {
        if (Array.isArray(skills.backend)) {
            return skills.backend;
        }
        return skills.backend.items || [];
    };

    const getOtherSkills = () => {
        if (Array.isArray(skills.other)) {
            return skills.other;
        }
        return skills.other?.items || skills.devops?.items || [];
    };

    const frontendTitle =
        skills.frontendTitle || skills.frontend?.title || 'Frontend Skills';
    const backendTitle =
        skills.backendTitle || skills.backend?.title || 'Backend Skills';
    const otherTitle =
        skills.otherTitle ||
        skills.other?.title ||
        skills.devops?.title ||
        'Other Skills';

    return (
        <section id="skills" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                    {skills.title}
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4"></span>
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Frontend Skills */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                <i className="fas fa-code text-xl"></i>
                            </div>
                            <h3 className="ml-4 font-bold text-xl text-gray-800">
                                {frontendTitle}
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {getFrontendSkills().map(
                                (skill: any, index: number) => (
                                    <li key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="flex items-center text-gray-700">
                                                <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                                                {skill.name}
                                            </span>
                                            <span className="font-medium text-blue-600">
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                        <div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="progress-fill bg-blue-500 h-full rounded-full"
                                                style={{
                                                    width: `${skill.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* Backend Skills */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shadow-sm">
                                <i className="fas fa-server text-xl"></i>
                            </div>
                            <h3 className="ml-4 font-bold text-xl text-gray-800">
                                {backendTitle}
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {getBackendSkills().map(
                                (skill: any, index: number) => (
                                    <li key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="flex items-center text-gray-700">
                                                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                {skill.name}
                                            </span>
                                            <span className="font-medium text-green-600">
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                        <div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="progress-fill bg-green-500 h-full rounded-full"
                                                style={{
                                                    width: `${skill.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* Other Skills (previously DevOps) */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                <i className="fas fa-tools text-xl"></i>
                            </div>
                            <h3 className="ml-4 font-bold text-xl text-gray-800">
                                {otherTitle}
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {getOtherSkills().map(
                                (skill: any, index: number) => (
                                    <li key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="flex items-center text-gray-700">
                                                <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                                                {skill.name}
                                            </span>
                                            <span className="font-medium text-purple-600">
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                        <div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="progress-fill bg-purple-500 h-full rounded-full"
                                                style={{
                                                    width: `${skill.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
