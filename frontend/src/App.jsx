import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, Search, Users, Star, Facebook, Instagram, Youtube } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RefreshCcw, Ticket, Zap, Map } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx"





export default function HeroSection() {

  const blogPosts = [
    {
      date: "Nov 14, 2022",
      title: "2023 Travel Trends – what you need to know",
      description: "2023 taught us valuable life lessons. Plans don't always work out, flexibility in life is key, a...",
      image: "https://i.pinimg.com/736x/f4/68/c1/f468c1d19eff59803b8a32def5baf45e.jpg",
      href: "#"
    },
    {
      date: "Nov 18, 2022",
      title: "Jeep Adventure is a new attraction for tourists visiting Garut",
      description: "Jeep Adventure is one of the tourist attractions that has been popular recently. The sensation...",
      image: "https://wallpapershome.com/images/pages/ico_h/26118.jpg",
      href: "#"
    }
  ]

  const tours = [
    {
      image: "https://cdn.create.vista.com/api/media/small/127814890/stock-photo-pura-ulun-danu-bratan-hindu-temple-on-bratan-lake-bali-indonesia",
      days: "7 Days",
      rating: "4.9",
      startDate: "23 AUGUST",
      endDate: "29 AUGUST",
      name: "Bali Tour Package",
      price: "285"
    },
    {
      image: "https://c4.wallpaperflare.com/wallpaper/569/529/191/landscape-photo-of-rock-mountain-superstition-mountains-superstition-mountains-wallpaper-preview.jpg",
      days: "5 Days",
      rating: "4.9",
      startDate: "23 AUGUST",
      endDate: "27 AUGUST",
      name: "Java Tour Package",
      price: "218"
    },
    {
      image: "https://i.pinimg.com/564x/84/a9/d1/84a9d1021978b02ce63a2a796ce17e70.jpg",
      days: "3 Days",
      rating: "4.9",
      startDate: "23 AUGUST",
      endDate: "25 AUGUST",
      name: "Solo Tour Package",
      price: "163"
    }
  ];

  


  const steps = [
    {
      icon: <RefreshCcw className="w-6 h-6" />,
      title: "Find your destination",
      description: "Embark on a journey to discover your dream destination, where adventure and relaxation await.",
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "Book a ticket",
      description: "Ensure a smooth travel experience by booking tickets to your preferred destination via our booking platform",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Make payment",
      description: "We offer a variety of payment options to meet your preferences and ensure a hassle-free transaction process.",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Explore destination",
      description: "You'll be immersed in a captivating tapestry of sights, sounds and tastes, as you wind your way through the ancient streets",
    },
  ];

  const [date, setDate] = useState(null);

  return (
    <>
   <Navbar/>
    <div className="relative min-h-screen">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3")',
        }}
      >
        <div className="absolute inset-0" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 text-center">
        <h1 className="max-w-3xl text-4xl mt-32 font-bold tracking-tight text-white sm:text-6xl">
          Extraordinary natural and cultural charm
        </h1>
        <p className="mt-6 text-lg text-white/90">
          Exploring Indonesia is an unforgettable adventure.
        </p>

        {/* Search Bar */}
        <div className="mt-10 flex flex-wrap  items-center justify-center gap-6 bg-white/10 backdrop-blur-md p-8 rounded-2xl">
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-[220px] bg-white justify-between rounded-lg text-lg py-4">
        <CalendarIcon className="mr-2 h-5 w-5" />
        {date ? date.toLocaleDateString() : "Date"}
        <ChevronDown className="ml-2 h-5 w-5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
    </PopoverContent>
  </Popover>

  <Button variant="outline" className="w-[220px] bg-white justify-between rounded-lg text-lg py-4">
    <Users className="mr-2 h-5 w-5" />
    Budget
    <ChevronDown className="ml-2 h-5 w-5" />
  </Button>

  <Button variant="outline" className="w-[220px] bg-white justify-between rounded-lg text-lg py-4">
    <Users className="mr-2 h-5 w-5" />
    Guest
    <ChevronDown className="ml-2 h-5 w-5" />
  </Button>

  <Button className="bg-primary text-white rounded-lg text-lg px-8 py-4">
    <Search className="mr-2 h-5 w-5" />
    Search
  </Button>
</div>


        {/* Stats */}
        {/* <div className="relative mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: "10M+", label: "Total Customers" },
            { value: "09+", label: "Years Experience" },
            { value: "12K", label: "Total Destinations" },
            { value: "5.0", label: "Customer Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-6 w-[280px] rounded-lg shadow-xl"
            >
              <div className="text-3xl font-semibold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div> */}

      </div>
    </div>
    
    <div className="max-w-7xl mx-auto p-6 mt-16">
      <div className="mb-2 text-sm font-medium text-gray-500">Best location</div>
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-5xl font-medium max-w-xl">Indonesian tourism</h2>
        <p className="text-gray-500  font-medium max-w-md text-sm">
          Extraordinary natural beauty, enjoy the rich culture, and experience the friendliness of the local people.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
  {/* Top row - wider first image, smaller second image */}
  <div className="col-span-2 relative h-96 rounded-2xl overflow-hidden">
    <img
      src="https://vl-prod-static.b-cdn.net/system/images/000/245/807/5afac395eb7db6dec84310176b5a1ba9/original/shutterstock_279422480.jpg?1691942778"
      alt="Bromo East Java"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white">
      <div className="font-medium">Bromo East Java</div>
      <div className="text-sm text-white/80">Bromo Tengger Tour</div>
    </div>
  </div>

  <div className="relative h-96 rounded-2xl overflow-hidden">
    <img
      src="https://urbanpixxels.com/wp-content/uploads/2018/10/Mount-Bromo-Tour-Volcano-East-Java-Indonesia-Mount-Batok-1.jpg"
      alt="Denpasar Bali"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white">
      <div className="font-medium">Denpasar Bali</div>
      <div className="text-sm text-white/80">Bali Beach Tourism</div>
    </div>
  </div>

  {/* Bottom row - smaller first image, wider second image */}
  <div className="relative h-96 rounded-2xl overflow-hidden">
    <img
      src="https://as1.ftcdn.net/v2/jpg/02/85/57/30/1000_F_285573044_xbj5B3nM2Yn8gQtYTi1f4lO8qEckyual.jpg"
      alt="Lampung South Sumatra"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white">
      <div className="font-medium">Lampung South Sumatra</div>
      <div className="text-sm text-white/80">Sumatra Tourism</div>
    </div>
  </div>

  <div className="col-span-2 relative h-96 rounded-2xl overflow-hidden">
    <img
      src="https://wallpapers.com/images/featured/hd-nature-ngdfb9h966h4z3le.jpg"
      alt="Jogjakarta Central Java"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
    <div className="absolute bottom-4 left-4 text-white">
      <div className="font-medium">Jogjakarta Central Java</div>
      <div className="text-sm text-white/80">Borobudur Temple Tour</div>
    </div>
  </div>
</div>
    </div>

    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-6 mt-32">
      {/* Left side - Image and Search */}
      <div className="lg:w-2/5">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwcGVvcGxlfGVufDB8fDB8fHww"
            alt="Person in yellow raincoat on beach"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Search filters */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white mb-4 max-w-md">
              Embark on a journey to find your dream destination, where adventure and relaxation await, creating unforgettable memories along the way
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">$0 - $500</SelectItem>
                  <SelectItem value="medium">$501 - $1000</SelectItem>
                  <SelectItem value="high">$1000+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Guest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Person</SelectItem>
                  <SelectItem value="2">2 People</SelectItem>
                  <SelectItem value="3">3+ People</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-white text-black hover:bg-white/90">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - How it works */}
      <div className="lg:w-1/2">
        <div className="space-y-8">
          <div>
            <p className="text-gray-600 mb-2">How it works</p>
            <h2 className="text-4xl font-medium font-bold">One click for you</h2>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-32">
      <div className="mb-16">
        <p className="text-gray-500 mb-4">Tour packages</p>
        <div className="flex justify-between items-start">
          <h2 className="text-5xl font-medium max-w-xl">Our tourist destination</h2>
          <p className="text-gray-500 max-w-md">
            Our tourist destinations offer an unrivaled blend of natural beauty and cultural richness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tours.map((tour, index) => (
          <div key={index} className="relative rounded-3xl overflow-hidden group cursor-pointer">
            <div className="aspect-[3/4]">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            
            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                {tour.days}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> {tour.rating}
              </span>
            </div>
            
            {/* Bottom content */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white/80 text-sm mb-2">
                {tour.startDate} - {tour.endDate}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white text-xl font-medium">{tour.name}</span>
                <span className="text-white text-xl">
                  <span className="text-sm">$</span>{tour.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="rounded-full px-8 bg-[#1B1B1B] text-white hover:bg-black/90">
          View more
        </Button>
      </div>
    </div>

    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-gray-500 mb-2">Our Blog</h2>
        <h1 className="text-4xl md:text-5xl font-medium font-bold tracking-tight">Our travel memories</h1>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
            <Link href={post.href}>
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-500 mb-4 font-medium" >{post.date}</p>
                <h3 className="text-2xl font-bold mb-4 leading-tight font-medium">{post.title}</h3>
                <p className="text-gray-600 font-medium">{post.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="bg-[#1B1B1B] font-medium text-white  py-3 px-8 rounded-full hover:bg-gray-800 transition-colors">
          View more
        </button>
      </div>
    </section>

    <Footer/>
    
    </>
    
  );
}