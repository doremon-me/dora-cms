import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import Icon from "@/lib/icons";
import { useGetProjects } from "./api";
import { Pages } from "@/components/shared/pages";
import {
  ProjectCard,
  ProjectCardSkeleton,
  type ProjectCardProps,
} from "./components/project.card";
import { useDebounce } from "@/hooks/useDebounce";
import AddProject from "./components/add.project";

const Projects = () => {
  const [searchParams, setSearchParams] = useState<{
    limit: number;
    sortBy: string;
    sort: "asc" | "desc";
    search: string;
    page: number;
  }>({
    limit: 8,
    sortBy: "createdAt",
    sort: "desc",
    search: "",
    page: 1,
  });
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isError } = useGetProjects(searchParams);

  const performSearch = (searchTerm: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const debouncedSearch = useMemo(() => useDebounce(performSearch, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <div className="flex gap-5 items-center justify-center pt-5">
        <div className="w-full max-w-[400px] flex items-center justify-center">
          <div className="flex items-center justify-center w-10 h-9 bg-muted rounded-l-md border-[1px] p-2.5">
            <Icon name="Search" />
          </div>
          <Input
            placeholder="Search projects..."
            className="w-full rounded-l-none border-l-0"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <AddProject>
          <Button variant="secondary">
            <Icon name="Plus" size={16} className="mr-2" />
            Add Project
          </Button>
        </AddProject>
      </div>

      {(searchValue || searchParams.search) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <Icon
                  name="Loader2"
                  size={14}
                  className="inline mr-1 animate-spin"
                />
                Searching...
              </>
            ) : (
              <>
                Found {data?.data?.length || 0} project
                {data?.data?.length !== 1 ? "s" : ""}
                {searchParams.search && ` for "${searchParams.search}"`}
              </>
            )}
          </p>
          {searchParams.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchValue("");
                setSearchParams((prev) => ({
                  ...prev,
                  search: "",
                  page: 1,
                }));
              }}
              className="w-fit self-start sm:self-auto"
            >
              <Icon name="X" size={14} className="mr-1" />
              Clear search
            </Button>
          )}
        </div>
      )}

      <br />

      {!isLoading && data?.data && data.data.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data.data.map((project: ProjectCardProps) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && data?.data && data.data.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Icon
              name="Search"
              size={28}
              className="sm:w-8 sm:h-8 text-muted-foreground/50"
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            No projects found
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {searchParams.search
              ? `No projects match your search for "${searchParams.search}"`
              : "No projects available. Create your first project to get started."}
          </p>
          {searchParams.search && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchValue("");
                setSearchParams((prev) => ({
                  ...prev,
                  search: "",
                  page: 1,
                }));
              }}
            >
              <Icon name="X" size={16} className="mr-2" />
              Clear search
            </Button>
          )}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Icon
              name="AlertCircle"
              size={28}
              className="sm:w-8 sm:h-8 text-red-500"
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Something went wrong
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Failed to load projects. Please check your connection and try again.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Pagination */}
      <Pages
        currentPage={searchParams.page}
        itemsPerPage={searchParams.limit}
        totalItems={data?.total || 0}
        onPageChange={(page: number) => {
          setSearchParams((prev) => {
            return {
              ...prev,
              page: page,
            };
          });
        }}
      />
    </div>
  );
};

export default Projects;
