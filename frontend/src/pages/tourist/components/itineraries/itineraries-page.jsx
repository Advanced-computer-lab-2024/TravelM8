import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import ItineraryCard from "@/components/ItineraryCard/ItineraryCard";
import { SearchBar } from "../filters/search";
import { getItineraries, getMyPreferredTags, getPreferenceTags } from "../../api/apiService";
import axios from "axios";
import { SelectFilter } from "../filters/select-filter";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Walkthrough } from '@/components/Walkthrough';
import { WalkthroughButton } from '@/components/WalkthroughButton';
import { useCurrency } from "../../../../hooks/currency-provider";

export function ItinerariesPage() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const { currency, exchangeRate } = useCurrency();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const token = localStorage.getItem("token");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(itineraries.length / itemsPerPage);
  // Paginated activities
  const paginatedItineraries = itineraries.slice(startIndex, endIndex);

  // Check if the user is a tourist (i.e., not an admin)
  const isAdmin = false; // Set to `true` for admin, `false` for tourists
  const { addSteps, clearSteps, currentPage: walkthroughPage } = useWalkthrough();
  useEffect(() => {
    if (walkthroughPage === 'itineraries') {
      clearSteps();
      addSteps([
        {
          target: '[data-tour="itinerary-search"]',
          content: 'Use the search bar to find itineraries by name or tag.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="itinerary-sort"]',
          content: 'Sort itineraries based on different criteria.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="itinerary-filters"]',
          content: 'Use these filters to refine your search results.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="itinerary-cards"]',
          content: 'Browse through our carefully curated itineraries.',
          disableBeacon: true,
        }
      ], 'itineraries');
    }
  }, [addSteps, clearSteps, walkthroughPage]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/bookmarks?type=Itinerary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const bookmarkedIds = data.allBookmarks
            .filter((b) => b.bookmark)
            .map((b) => b.itemId._id);
          setBookmarkedItineraries(bookmarkedIds);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  const handleBookmark = async (itineraryId) => {
    if (!token) {
      toast(`Failed to bookmark itinerary`, {
        description: `You need to be logged in first`,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: itineraryId,
          itemType: "Itinerary",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.bookmark?.bookmark) {
          setBookmarkedItineraries((prev) => [...prev, itineraryId]);
        } else {
          setBookmarkedItineraries((prev) =>
            prev.filter((id) => id !== itineraryId)
          );
        }
        toast(`${data.message}`);
      }
    } catch (error) {
      console.error("Error while bookmarking:", error);
      toast("Failed to update bookmark");
    }
  };

  const fetchItineraries = useDebouncedCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("isAdmin", isAdmin);
    queryParams.set("currency", currency);

    try {
      let fetchedItineraries = (
        await getItineraries(`?${queryParams.toString()}`, token)
      );

      // Filter out flagged itineraries if the user is a tourist
      if (!isAdmin) {
        fetchedItineraries = fetchedItineraries.filter(
          (itinerary) => !itinerary.flagged
        );
      }
      setItineraries(fetchedItineraries);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  }, 200);

  useEffect(() => {
    fetchItineraries();
  }, [location.search, currency, priceRange]);

  const searchCategories = [
    { name: "Name", value: "name" },
    { name: "Tag", value: "tag" },
  ];

  const sortOptions = [
    ...(token ? [{ value: "tags-pref", description: "My Preferences" }] : []),
    { value: "price-asc", description: "Price: Low to High" },
    { value: "price-desc", description: "Price: High to High" },
    { value: "averageRating-desc", description: "Rating" },
];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };

  return (
    <div className="mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-16 h-full" >
          <div data-tour="itinerary-search">
            <SearchBar categories={searchCategories} />
          </div>
          <Separator className="mb-5" />
          <div data-tour="itinerary-filters">
            <DateFilter />
            <Separator className="mt-5" />
            <PriceFilter
              currency={currency}
              exchangeRate={exchangeRate}
            />
            <Separator className="mt-5" />
            <SelectFilter
              name="Languages"
              paramName="language"
              getOptions={async () => ["Arabic", "English", "German"]}
            />
            <Separator className="mt-5" />
            <SelectFilter name="Tags" paramName="tag" getOptions={getPreferenceTags} />
          </div>
        </div>
        <div className="w-full md:w-3/4" data-tour="itinerary-cards">
          <div className="flex justify-between items-center mb-6">
            <div className="flex h-5 items-center space-x-4 text-sm">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>{itineraries.length} results</div>
              )}
              <ClearFilters />
            </div>
            <div data-tour="itinerary-sort">
              <SortSelection options={sortOptions} />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-48">
              <CircularProgress />
            </div>
          ) : (
            <><ItineraryCard
              itineraries={paginatedItineraries}
              isTourist={true}
              currency={currency}
              exchangeRate={exchangeRate}
              bookmarkedItineraries={bookmarkedItineraries} // Add this prop
              handleBookmark={handleBookmark} /><div className="flex justify-center mt-6 space-x-2">
                <div className="flex justify-center mt-6 ">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scroll(0, 0);
                      }}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div></div></>

          )}

        </div>
      </div>
      <Walkthrough />
    </div>
  );
}
