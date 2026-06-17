'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLatestRooms } from '../lib/api';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Search, Shield, Star, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [synchronizedInventoryCollection, setSynchronizedInventoryCollection] = useState([]);
  const [componentPayloadLoading, setComponentPayloadLoading] = useState(true);

  
  useEffect(() => {
    document.title = 'StudyNook – Home';
    getLatestRooms()
      .then(payloadData => setSynchronizedInventoryCollection(payloadData))
      .catch(runtimeError => console.error(runtimeError))
      .finally(() => setComponentPayloadLoading(false));
  }, []);

  return (
    <div className="min-h-screen page-wrapper">
      
      
      <section className="relative overflow-hidden rounded-3xl mx-4 my-6 max-w-7xl lg:mx-auto bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-emerald-200 mb-6 animate-pulse">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Premium Study Nodes Available
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
              Discover Your Optimal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Focused Environment</span>
            </h1>
            
            <p className="text-base sm:text-lg text-emerald-100/80 mb-10 max-w-xl leading-relaxed">
              Instantly lock validated local study rooms or list your dormant institutional layouts to maximize localized financial returns effortlessly.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/rooms" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-950/20 ripple text-sm">
                <Search className="w-4.5 h-4.5" /> Explore Rooms
              </Link>
              <Link href="/add-room" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105 active:scale-95 ripple text-sm">
                List Your Room <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>
          
          {/* Analytical High-Value Benchmarks Matrix */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm pt-8 border-t border-white/10">
            {[
              { metricsValue: '500+', clusterLabel: 'Study Rooms' },
              { metricsValue: '12k+', clusterLabel: 'Bookings' },
              { metricsValue: '4.9★', clusterLabel: 'Avg Rating' }
            ].map(metricNode => (
              <div key={metricNode.clusterLabel} className="text-left">
                <div className="text-2xl font-extrabold text-white tracking-tight">{metricNode.metricsValue}</div>
                <div className="text-xs text-emerald-300/80 font-medium mt-0.5">{metricNode.clusterLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INVENTORY EXHIBITION: Real-time Cataloging */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Available Now</p>
            <h2 className="section-title">Latest Study Rooms</h2>
          </div>
          <Link href="/rooms" className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:gap-2.5 transition-all duration-200 group">
            View All Rooms <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        {componentPayloadLoading ? (
          <LoadingSpinner />
        ) : synchronizedInventoryCollection.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 card border-dashed">
            <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No active rooms mapped yet.</p>
            <Link href="/add-room" className="mt-4 inline-block btn-primary text-sm">List the First Room</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {synchronizedInventoryCollection.map(individualRoomItem => (
              <RoomCard key={individualRoomItem.id} room={individualRoomItem} />
            ))}
          </div>
        )}
      </section>

      {/* 3. WORKFLOW PIPELINE: Simple Implementation Process */}
      <section className="bg-gray-50/60 dark:bg-gray-800/30 border-y border-gray-100 dark:border-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="section-title">How StudyNook Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { pipelineIcon: <Search className="w-6 h-6" />, numericStep: '01', layoutTitle: 'Search & Browse', coreDescription: 'Explore our curated collection of quiet study rooms. Filter by amenities, floor, capacity, and price.' },
              { pipelineIcon: <Clock className="w-6 h-6" />, numericStep: '02', layoutTitle: 'Pick Your Slot', coreDescription: 'Choose your preferred date and time slot. Our real-time system prevents any double bookings automatically.' },
              { pipelineIcon: <CheckCircle className="w-6 h-6" />, numericStep: '03', layoutTitle: 'Confirm & Study', coreDescription: 'Get instant confirmation. Head to your room and enjoy a distraction-free study session.' },
            ].map(pipelineNode => (
              <div key={pipelineNode.numericStep} className="card p-8 text-center hover:-translate-y-1 group transition-all duration-300">
                <div className="relative mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  {pipelineNode.pipelineIcon}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white dark:border-gray-800 shadow-sm">{pipelineNode.numericStep}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3 tracking-tight">{pipelineNode.layoutTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{pipelineNode.coreDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARATIVE MATRIX: System Competitive Edge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Why StudyNook</p>
            <h2 className="section-title">The smarter way to find study space</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              We engineered StudyNook to bypass traditional library log bottlenecks. Our system provides direct architecture links to immediate local nodes.
            </p>
            
            <div className="space-y-4 pt-2">
              {[
                { edgeIcon: <Shield className="w-4.5 h-4.5" />, mainHeadline: 'No Double Bookings', dynamicSubDesc: 'Real-time conflict detection ensures your reservation is always guaranteed.' },
                { edgeIcon: <Star className="w-4.5 h-4.5" />, mainHeadline: 'Quality Spaces', dynamicSubDesc: 'Every room is reviewed and equipped with the amenities you need.' },
                { edgeIcon: <Users className="w-4.5 h-4.5" />, mainHeadline: 'Earn from Your Space', dynamicSubDesc: 'Have a study room? List it and start earning from your unused space today.' },
              ].map(edgeNode => (
                <div key={edgeNode.mainHeadline} className="flex gap-4 group items-start">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 border border-emerald-100/10 shadow-sm">
                    {edgeNode.edgeIcon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-0.5 tracking-tight">{edgeNode.mainHeadline}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-normal">{edgeNode.dynamicSubDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fast Onboarding Interaction Display Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-700/15 rounded-3xl -rotate-2 scale-105 pointer-events-none" />
            <div className="relative bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
              <h3 className="font-display text-2xl font-extrabold mb-6 tracking-tight">Start in under 2 minutes</h3>
              <ul className="space-y-4">
                {['Create your free account', 'Browse available rooms near you', 'Book with one click', 'Get instant confirmation'].map((sequentialTextLine, numericIndex) => (
                  <li key={sequentialTextLine} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 bg-white/10 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 border border-white/10 text-emerald-300">{numericIndex + 1}</span>
                    <span className="text-emerald-100/90 font-medium">{sequentialTextLine}</span>
                  </li>
                ))}
              </ul>
              <Link href="/rooms" className="mt-8 inline-flex items-center gap-2 bg-white text-emerald-900 font-bold px-6 py-3.5 rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 ripple text-sm shadow-md">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}