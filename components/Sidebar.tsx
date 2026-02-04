"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProjectStore } from "@/store/useProjectStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogoutButton } from "./LogoutButton";

export function Sidebar() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject,
  );
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const userId = userData?.id;

 const { data: projects, isLoading } = useQuery({
  queryKey: ["projects", userId], 
  queryFn: async () => {
    if (!userId) return [];
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId) 
      .order("created_at", { ascending: false });
    return data || [];
  },
  enabled: !!userId, 
});

  const addProject = useMutation({
    mutationFn: async (newTitle: string) => {
      if (!userId) throw new Error("user not found");
      const { error } = await supabase
        .from("projects")
        .insert([{ title: newTitle, user_id: userId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const editProject = useMutation({
    mutationFn: async ({ id, newTitle }: { id: number; newTitle: string }) => {
      const { error } = await supabase
        .from("projects")
        .update({ title: newTitle })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col h-full shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
            TaskFlow
          </h2>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="px-4 py-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Directories
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2 px-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-slate-200/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          projects?.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex items-center px-2"
            >
              <button
                onClick={() => setSelectedProject(proj.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  selectedProjectId === proj.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                <span className="opacity-50 mr-2">#</span> {proj.title}
              </button>

              <div className="absolute right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => {
                    const newName = prompt("New name:", proj.title);
                    if (newName && newName !== proj.title)
                      editProject.mutate({ id: proj.id, newTitle: newName });
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete workspace?"))
                      deleteProject.mutate(proj.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </nav>

      <div className="p-6 bg-white/50 border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) addProject.mutate(title);
          }}
          className="relative"
        >
          <input
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New workspace..."
          />
          <button
            type="submit"
            disabled={addProject.isPending}
            className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-3 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-50"
          >
            {addProject.isPending ? "..." : "Add"}
          </button>
        </form>
        <LogoutButton/>
      </div>
    </aside>
  );
}
