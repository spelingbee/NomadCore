"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Compass, Building2, Shield, ChevronDown } from "lucide-react";

export type AppMode = "traveler" | "partner" | "admin";

interface ModeSwitcherProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const modes = [
  {
    id: "traveler" as const,
    label: "Traveler",
    description: "Browse & book experiences",
    icon: Compass,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/30",
  },
  {
    id: "partner" as const,
    label: "Partner",
    description: "Manage your tourism business",
    icon: Building2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    id: "admin" as const,
    label: "Government",
    description: "National tourism oversight",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
];

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const current = modes.find((m) => m.id === currentMode)!;
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 ${current.bg} border-current/20 hover:${current.bg}`}
        >
          <CurrentIcon className={`h-4 w-4 ${current.color}`} />
          <span className="font-medium">{current.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex items-start gap-3 p-3 cursor-pointer ${
                currentMode === mode.id ? mode.bg : ""
              }`}
            >
              <div className={`p-2 rounded-lg ${mode.bg}`}>
                <Icon className={`h-4 w-4 ${mode.color}`} />
              </div>
              <div>
                <p className="font-medium">{mode.label}</p>
                <p className="text-xs text-muted-foreground">
                  {mode.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModeIndicator({ mode }: { mode: AppMode }) {
  const current = modes.find((m) => m.id === mode)!;
  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${current.bg} ${current.color}`}
    >
      <Icon className="h-4 w-4" />
      {current.label} Mode
    </div>
  );
}
