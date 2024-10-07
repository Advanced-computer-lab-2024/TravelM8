import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/lib/utils.ts"

const pages = [
    { label: "Activities", value: "activities" },
    { label: "Itineraries", value: "itineraries" },
    { label: "Museums & Historical Places", value: "museums" },
    { label: "Products", value: "products" },
];

export function NavBar() {
    const { location, searchParams, navigate } = useRouter();
    const currentPage = searchParams.get("type");

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {pages.map((page) => (
                <Button
                    key={page.value}
                    variant={currentPage === page.value ? "outline" : "ghost"}
                    className={cn(
                        "rounded-full py-2 px-4 border-[1px]", // Always apply these classes
                        { 'border-transparent bg-transparent': currentPage !== page.value }
                    )}
                    onClick={() => navigate(`${location.pathname}?type=${page.value}`)}
                >
                    {page.label}
                </Button>
            ))}
        </div>
    );
}