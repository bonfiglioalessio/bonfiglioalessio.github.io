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
        technology: ["React", "Material UI", "Redux", "Webpack"],
        link: "www.google.it",
    },
    {
        key: 1,
        name: "Sunshi",
        image: "/project/sunshi.svg",
        technology: ["React", "Typescript", "SCSS", "Redux", "Vite"],
        link: "www.google.it",
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