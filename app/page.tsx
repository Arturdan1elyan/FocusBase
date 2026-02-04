import { ProjectView } from "@/components/ProjectView";
import { Sidebar } from "@/components/Sidebar";

export default function page() {
return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
        <ProjectView />
      </div>
    </div>
  );
}
