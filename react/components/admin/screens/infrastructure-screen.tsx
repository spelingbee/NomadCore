"use client";

import { useState } from "react";
import { mockInfrastructureProjects } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Filter,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  planned: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

export function InfrastructureScreen() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects =
    statusFilter === "all"
      ? mockInfrastructureProjects
      : mockInfrastructureProjects.filter((p) => p.status === statusFilter);

  const totalBudget = mockInfrastructureProjects.reduce(
    (sum, p) => sum + p.budget,
    0
  );
  const completedProjects = mockInfrastructureProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressProjects = mockInfrastructureProjects.filter(
    (p) => p.status === "in-progress"
  ).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Infrastructure Projects"
        description="Track and manage tourism infrastructure development"
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={mockInfrastructureProjects.length}
          icon={<Building className="h-4 w-4" />}
        />
        <StatCard
          title="Total Budget"
          value={`$${(totalBudget / 1000000).toFixed(1)}M`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressProjects}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Completed"
          value={completedProjects}
          trend={{ value: 25, isPositive: true }}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Project Overview</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "in-progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "planned" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("planned")}
            >
              Planned
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge className={statusColors[project.status]}>
                        {project.status.replace("-", " ")}
                      </Badge>
                      <Badge className={priorityColors[project.priority]}>
                        {project.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {project.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        ${(project.budget / 1000000).toFixed(2)}M budget
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {project.timeline}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{project.progress}%</p>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Projects Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInfrastructureProjects
                .filter((p) => p.progress < 50 && p.status === "in-progress")
                .slice(0, 3)
                .map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.progress}% complete - {project.timeline}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
              {mockInfrastructureProjects.filter(
                (p) => p.progress < 50 && p.status === "in-progress"
              ).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All projects are on track
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Budget Allocation by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(
                new Set(mockInfrastructureProjects.map((p) => p.region))
              ).map((region) => {
                const regionProjects = mockInfrastructureProjects.filter(
                  (p) => p.region === region
                );
                const regionBudget = regionProjects.reduce(
                  (sum, p) => sum + p.budget,
                  0
                );
                const percentage = (regionBudget / totalBudget) * 100;

                return (
                  <div key={region}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{region}</span>
                      <span className="text-sm text-muted-foreground">
                        ${(regionBudget / 1000000).toFixed(1)}M ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
