"use client";

import { supabase } from "@/lib/supabase";
import { useProjectStore } from "@/store/useProjectStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function ProjectView() {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const queryClient = useQueryClient();
  const [taskTitle, setTaskTitle] = useState("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", selectedProjectId],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", selectedProjectId)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selectedProjectId,
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from("tasks")
        .insert([{ title, project_id: selectedProjectId, is_complated: false }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedProjectId] });
      setTaskTitle("");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedProjectId] });
    },
  });

  const toggleTaskStatus = useMutation({
    mutationFn: async ({ id, is_complated }: { id: number; is_complated: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ is_complated: !is_complated })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedProjectId] });
    },
  });

  const editTask = useMutation({
    mutationFn: async ({ id, newTitle }: { id: number; newTitle: string }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ title: newTitle })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedProjectId] });
    },
  });

  if (!selectedProjectId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <div className="w-20 h-20 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-600">No Project Selected</h3>
        <p className="text-sm">Choose a workspace from the sidebar</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Workspace</h1>
          <p className="text-slate-500 font-medium mt-1">Focus on your daily progress</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (taskTitle.trim()) addTask.mutate(taskTitle); }} className="flex gap-2">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            type="text"
            placeholder="What's next?"
            className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
          />
          <button disabled={addTask.isPending} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-200">
            {addTask.isPending ? "..." : "Add"}
          </button>
        </form>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)}
        </div>
      ) : tasks?.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
          <p className="text-slate-400 font-bold italic text-lg">Your task list is empty.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks?.map((task) => (
            <div key={task.id} className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div
                  onClick={() => toggleTaskStatus.mutate({ id: task.id, is_complated: task.is_complated })}
                  className={`w-7 h-7 border-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    task.is_complated ? "bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200" : "border-slate-200 group-hover:border-indigo-400"
                  }`}
                >
                  {task.is_complated && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-base font-bold transition-all uppercase tracking-tighter ${task.is_complated ? "line-through text-slate-300" : "text-slate-700"}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => {
                    const newTitle = prompt("Edit task:", task.title);
                    if (newTitle && newTitle !== task.title) editTask.mutate({ id: task.id, newTitle });
                  }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => { if(confirm("Delete task?")) deleteTask.mutate(task.id) }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}