export interface ProjectProps {
    key: number;
    name: string;
    image: string;
    technology: string[];
    link: string;
}

const ProjectList: ProjectProps[] = [
    {
        key: 0,
        name: "Snorlax Toodo!",
        image: "/project/snorlax.svg",
        technology: ["Preact", "Material UI", "Redux"],
        link: "https://snorlax-toodo.netlify.app",
    },
    {
        key: 1,
        name: "Weather App",
        image: "/project/sunshi.svg",
        technology: ["React", "Sass", "Vite", "Moment", "Recharts"],
        link: "https://bonfi-weather-app.netlify.app/",
    },
    {
        key: 2,
        name: "Unique Photography",
        image: "/project/unique.png",
        technology: ["Next.js", "Contentful", "GraphQL", "Tailwind"],
        link: "https://www.uniquephotography.it",
    }
]

export default ProjectList;