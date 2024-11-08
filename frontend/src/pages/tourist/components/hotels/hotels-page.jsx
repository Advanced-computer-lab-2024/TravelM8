import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect, useRef } from "react";
import useRouter from "@/hooks/useRouter";

import { MapPin, BedDouble } from 'lucide-react';

import axios from "axios";

import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { SingleDateFilter } from '../filters/single-date-filter';
import { CityFilter } from '../filters/city-filter';
import { getHotels, getToken } from '../../api/apiService';
import { Hotels } from './hotels';

function createImage(location) {
    function lucideImage(image) {
        return <div className="flex-shrink-0 !w-[48px] !h-[48px] flex items-center justify-center bg-gray-100 rounded-sm">
            {image}
        </div>
    }

    let image;
    if ("destination_images" in location)
        image = <img className="flex-shrink-0 w-[48px] h-[48px] rounded-sm" src={`${location["destination_images"]["image_jpeg"]}`} />
    else if (location["displayType"]["type"] == "hotel")
        image = lucideImage(<BedDouble className="!w-[36px] !h-[27px]" />)
    else
        image = lucideImage(<MapPin className="!w-[36px] !h-[27px]" />)

    return image
}

async function fetchLocations(name) {
    const results = await axios.post(`https://www.hotelscombined.com/mvm/smartyv2/search?where=${name}`);
    return results["data"].map((location) => {
        const indexId = location.indexId;
        const searchKey = indexId.includes("-") ? indexId.split("-")[1] : indexId;
        return {
            label: <h3 className="truncate text-base font-medium text-gray-900">{location.displayname}</h3>,
            sublabel: <p className="text-sm text-gray-500">{location.displayType.displayName}</p>,
            value: `${location.displayname}--${location.entityKey.split(':')[0]}:${searchKey}`,
            image: createImage(location)
        }
    });
}

export function HotelsPage() {
    const { location } = useRouter();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const requestCounter = useRef(0);

    const fetchHotels = useDebouncedCallback(async () => {
        setLoading(true);

        const currentRequestId = ++requestCounter.current;
        const hotels = await getHotels(location.search);
        
        const mapped = hotels.map((hotel) => {
            if (!("providers" in hotel))
                return null;

            const name = hotel.localizedHotelName;
            const nearby = "Nearby: " + hotel.localizedNearbyLandmarkNames.join(', ');
            const location = hotel.geolocation.localizedCity;
            const price = hotel.providers[0].totalPrice.localizedPrice;
            const rating = hotel.rating.scoreDisplay;
            const ratingCount = hotel.rating.reviewCountDisplay;
            const ratingCategory = hotel.rating.localizedRatingCategory;
            const ratingStars = hotel.stars;
            const image = hotel.images.length != 0 ? hotel.images[0].thumbnailSrc : 'https://content.r9cdn.net/res/images/hotels/results/list/hotel-photo-placeholder.jpg'
            return { name, nearby, location, price, rating, ratingCount, ratingCategory, ratingStars, image };
        }).filter(item => item !== null);

        if (currentRequestId === requestCounter.current)
            setHotels(mapped);

        setLoading(false);
    }, 200);

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        fetchHotels();
    }, [location.search]); // Only run when location.search changes

    const sortOptions = [
        { value: 'price-price_a', description: 'Price: Low to High' },
        { value: 'price-price_b', description: 'Price: High to Low' },
        { value: 'rating-userrating_b', description: 'Rating' },
    ];

    return <>
        <div className="flex justify-between space-x-6">
            <CityFilter className="flex-1" name="Where" getData={fetchLocations} />
            <SingleDateFilter className="flex-1" name="Check in" param="checkin" />
            <SingleDateFilter className="flex-1" name="Check out" param="checkout" />
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <PriceFilter />
            </div>
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-10 items-center space-x-4 text-sm">
                        {loading ? <div>Loading...</div> : <div>{hotels.length} results</div>}
                        <ClearFilters />
                    </div>
                    <SortSelection options={sortOptions} />
                </div>
                <Hotels hotels={hotels} />
            </div>
        </div>
    </>
}