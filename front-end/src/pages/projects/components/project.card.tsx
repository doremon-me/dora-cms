import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/formate";
import Icon from "@/lib/icons";

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  type: string | null | undefined;
  origin: string | null | undefined;
  createdAt: Date;
  updatedAt: Date | null | undefined;
}

export const ProjectCard = (project: ProjectCardProps) => {
  return (
    <Card className="group relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:outline-1">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
            project.updatedAt
              ? "bg-green-500 group-hover:bg-green-400"
              : "bg-gray-300 group-hover:bg-gray-400"
          }`}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-1 pr-8 group-hover:text-primary transition-colors duration-200">
            {project.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-xs font-medium w-fit transition-all duration-200 group-hover:scale-105"
          >
            {project.type ? project.type : "(Not specified)"}
          </Badge>
        </div>

        <CardDescription className="text-sm leading-relaxed line-clamp-2 mt-2 group-hover:text-foreground/80 transition-colors duration-200">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 py-3">
        {/* Origin */}
        <div
          className={`flex items-center justify-between text-sm p-2 rounded-md transition-all duration-200 ${
            project.origin
              ? "hover:bg-muted/80 cursor-pointer group/origin"
              : "hover:bg-muted/50"
          }`}
          onClick={() => {}}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon
              name="Globe"
              size={14}
              className={`transition-transform duration-200 ${
                project.origin ? "group-hover/origin:scale-110" : ""
              }`}
            />
            <span>Origin</span>
          </div>
          <span
            className={`font-medium transition-colors duration-200 ${
              project.origin
                ? "text-primary hover:text-primary/80 group-hover/origin:underline"
                : "text-foreground"
            }`}
          >
            {project.origin || (
              <span className="text-muted-foreground italic">
                Not specified
              </span>
            )}
            {project.origin && (
              <Icon
                name="ExternalLink"
                size={12}
                className="ml-1 inline opacity-0 group-hover/origin:opacity-100 transition-opacity duration-200"
              />
            )}
          </span>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon
                name="Calendar"
                size={12}
                className="transition-colors duration-200"
              />
              <span className="text-xs">Created</span>
            </div>
            <div className="text-xs font-medium">
              {formatRelativeTime(project.createdAt)}
            </div>
          </div>

          <div className="space-y-1 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon
                name="Clock"
                size={12}
                className="transition-colors duration-200"
              />
              <span className="text-xs">Updated</span>
            </div>
            <div className="text-xs font-medium">
              {project.updatedAt
                ? formatRelativeTime(project.updatedAt)
                : "NaN"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <Card className="group relative">
      {/* Status indicator skeleton */}
      <div className="absolute top-4 right-4 z-10">
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 pr-8" />

          {/* Badge skeleton */}
          <div className="w-fit">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 py-3">
        {/* Origin skeleton */}
        <div className="flex items-center justify-between text-sm p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Timestamps skeleton */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 p-2 rounded-md">
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-3 h-3 rounded" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="space-y-1 p-2 rounded-md">
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-3 h-3 rounded" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
