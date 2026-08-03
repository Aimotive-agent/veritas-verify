import ProjectDetailClient from "./client";

export function generateStaticParams() {
  const projects = [
    { id: "prj-001" },
    { id: "prj-002" },
    { id: "prj-003" },
    { id: "prj-004" },
    { id: "prj-005" },
    { id: "prj-new" },
  ];
  return projects.map((p) => ({ id: p.id }));
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProjectDetailClient />;
}
