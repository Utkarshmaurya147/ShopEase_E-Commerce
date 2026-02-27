'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { 
  CpuChipIcon, ShoppingBagIcon, HomeIcon, SparklesIcon, BeakerIcon, 
  MusicalNoteIcon, TvIcon, LightBulbIcon, HeartIcon, RocketLaunchIcon,
  WrenchScrewdriverIcon, AcademicCapIcon, CameraIcon, GlobeAltIcon,
  FireIcon, BriefcaseIcon, TruckIcon, DevicePhoneMobileIcon, GiftIcon,
  FaceSmileIcon, QuestionMarkCircleIcon, ChevronRightIcon
} from "@heroicons/react/24/outline";

// 1. Mapping Object: Matches DB names to your UI styles
const categoryStyles: any = {
  // TECH & GADGETS
  'Computing': { icon: CpuChipIcon, color: 'bg-blue-50', text: 'text-blue-600' },
  'Smartphones': { icon: DevicePhoneMobileIcon, color: 'bg-cyan-50', text: 'text-cyan-600' },
  'Audio & Music': { icon: MusicalNoteIcon, color: 'bg-indigo-50', text: 'text-indigo-600' },
  'Cameras': { icon: CameraIcon, color: 'bg-slate-50', text: 'text-slate-600' },
  'TV & Video': { icon: TvIcon, color: 'bg-red-50', text: 'text-red-600' },

  // LIFESTYLE & FASHION
  'Menswear': { icon: ShoppingBagIcon, color: 'bg-sky-50', text: 'text-sky-600' },
  'Womenswear': { icon: HeartIcon, color: 'bg-rose-50', text: 'text-rose-600' },
  'Footwear': { icon: RocketLaunchIcon, color: 'bg-orange-50', text: 'text-orange-600' },
  'Accessories': { icon: SparklesIcon, color: 'bg-purple-50', text: 'text-purple-600' },
  'Jewelry': { icon: GiftIcon, color: 'bg-yellow-50', text: 'text-yellow-600' },

  // HOME & OFFICE
  'Furniture': { icon: HomeIcon, color: 'bg-amber-50', text: 'text-amber-600' },
  'Lighting': { icon: LightBulbIcon, color: 'bg-yellow-100', text: 'text-yellow-700' },
  'Kitchenware': { icon: FireIcon, color: 'bg-orange-100', text: 'text-orange-700' },
  'Stationery': { icon: BriefcaseIcon, color: 'bg-emerald-50', text: 'text-emerald-600' },
  'DIY & Tools': { icon: WrenchScrewdriverIcon, color: 'bg-stone-50', text: 'text-stone-600' },

  // WELLNESS & OTHER
  'Beauty': { icon: FaceSmileIcon, color: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  'Health': { icon: BeakerIcon, color: 'bg-green-50', text: 'text-green-600' },
  'Sports': { icon: GlobeAltIcon, color: 'bg-lime-50', text: 'text-lime-600' },
  'Books & Learning': { icon: AcademicCapIcon, color: 'bg-violet-50', text: 'text-violet-600' },
  'Automotive': { icon: TruckIcon, color: 'bg-zinc-50', text: 'text-zinc-600' },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/all"); 
        setCategories(res.data.categories);  
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0a1128] min-h-screen selection:bg-blue-500/30">
      {/* Header Section with Mesh Gradient */}
      <div className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <nav className="flex justify-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">Departments</span>
          </nav>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4">
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Departments</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Everything you need, organized by our curated collections.
          </p>
        </div>
      </div>

      {/* Categories Bento Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((cat: any, index: number) => {
            const style = categoryStyles[cat.name] || { 
              icon: QuestionMarkCircleIcon, 
              color: 'from-gray-500/10 to-transparent', 
              text: 'text-gray-400' 
            };

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={`group relative flex flex-col justify-between p-8 rounded-[40px] border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500 ${
                  index % 5 === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-[24px] bg-gradient-to-br ${style.color} ${style.text} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <style.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Explore the collection</p>
                </div>

                <div className="relative z-10 mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                  Shop Now <ChevronRightIcon className="h-4 w-4" />
                </div>

                {/* Subtle Background Glow for each card */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all duration-700" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}