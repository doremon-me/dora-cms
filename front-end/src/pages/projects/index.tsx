import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import Icon from "@/lib/icons";
import { Link } from "react-router-dom";
import { useLogout } from "../auth/api";
import { ConfirmDialog } from "@/components/shared/confirm";
import { useGetProjects } from "./api";
import { Pages } from "@/components/shared/Pages";
import {
  ProjectCard,
  ProjectCardSkeleton,
  type ProjectCardProps,
} from "./components/project.card";
import { useDebounce } from "@/hooks/useDebounce";

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
  const { mutate: logout } = useLogout();
  const { data, isLoading, isError } = useGetProjects(searchParams);

  const performSearch = (searchTerm: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const debouncedSearch = useMemo(() => useDebounce(performSearch, 500), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <header className="sticky z-50 top-0 bg-background/95 backdrop-blur-sm border-b transition-all duration-300 flex justify-between items-center">
        <div className="py-3">
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="FolderOpen" size={20} className="text-primary" />
              <h2 className="font-semibold text-lg">Projects</h2>
            </div>
            <div className="flex-1 max-w-md relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search projects..."
                className="w-full pl-10 pr-10"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {searchParams.search && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    setSearchParams((prev) => ({
                      ...prev,
                      search: "",
                      page: 1,
                    }));
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
            <Link to="create" className="flex items-center">
              <Button variant="secondary">
                <Icon name="Plus" size={16} className="mr-2" />
                Add Project
              </Button>
            </Link>
          </div>

          <div className="lg:hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="FolderOpen" size={18} className="text-primary" />
                <h2 className="font-semibold text-base sm:text-lg">Projects</h2>
              </div>
              <Link to="create" className="flex items-center">
                <Button variant="secondary">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add Project
                </Button>
              </Link>
            </div>

            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search projects..."
                className="w-full pl-10 pr-10"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {searchParams.search && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    setSearchParams((prev) => ({
                      ...prev,
                      search: "",
                      page: 1,
                    }));
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        <ConfirmDialog
          cancelText="Cancel"
          confirmText="Logout"
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={logout}
          variant="warning"
        >
          <Button>Logout</Button>
        </ConfirmDialog>
      </header>

      <br />

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
        onPageChange={() => {
          setSearchParams((prev) => {
            const newPage = prev.page + 1;
            return {
              ...prev,
              page: newPage > Math.ceil(data.total / prev.limit) ? 1 : newPage,
            };
          });
        }}
      />
    </div>
  );
};

export default Projects;
