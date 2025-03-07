// 定义 Channel 类型的联合类型
type Channel =
    | {
          type: string;
          title: string;
          value: string;
          link: string;
          icon: string;
          showQRCode?: undefined;
          qrCodeImage?: undefined;
          items?: undefined;
      }
    | {
          type: string;
          title: string;
          value: string;
          icon: string;
          showQRCode: boolean;
          qrCodeImage: string;
          link?: undefined;
          items?: undefined;
      }
    | {
          type: string;
          title: string;
          items: { title: string; link: string }[];
          icon: string;
          value?: undefined;
          link?: undefined;
          showQRCode?: undefined;
          qrCodeImage?: undefined;
      };

// 更新 Dictionary 类型
export type Dictionary = {
    meta: { title: string; description: string };
    languages: { en: string; zh: string };
    nav: {
        about: string;
        skills: string;
        experience: string;
        projects: string;
        contact: string;
    };
    hero: {
        name: string;
        title: string;
        description: string;
        contactButton: string;
        projectsButton: string;
    };
    about: {
        title: string;
        philosophy: { title: string; description: string };
        strengths: {
            title: string;
            items: { title: string; description: string }[];
        };
    };
    skills: {
        title: string;
        frontendTitle: string;
        backendTitle: string;
        otherTitle: string;
        frontend: { name: string; percentage: number }[];
        backend: { name: string; percentage: number }[];
        other: { name: string; percentage: number }[];
    };
    experience: {
        title: string;
        jobs: {
            company: string;
            position: string;
            period: string;
            description?: string;
            projects?: {
                title: string;
                description: string;
                achievements: string[];
            }[];
        }[];
    };
    projects: {
        title: string;
        items: {
            title: string;
            description: string;
            stars: string;
            technologies: string[];
            link: string;
            gradient: string;
            badgeColor: { bg: string; text: string };
        }[];
    };
    contact: {
        title: string;
        getInTouch: {
            title: string;
            description: string;
            channels: Channel[]; // 使用更新后的 Channel 类型
        };
        form: {
            title: string;
            fields: {
                name: string;
                email: string;
                message: string;
            };
            submitButton: string;
        };
    };
    footer: {
        name: string;
        description: string;
        copyright: string;
    };
};

export type Locale = 'en' | 'zh';
