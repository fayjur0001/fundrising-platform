// src/app/(public)/campaigns/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CampaignGrid from '@/components/campaign/CampaignGrid'
import SearchBar from '@/components/campaign/SearchBar'
import CategoryFilter from '@/components/campaign/CategoryFilter'
import Pagination from '@/components/ui/pagination'
import { mockCampaigns } from '@/lib/mockData'
import { SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  'Education',
  'Medical',
  'Environment',
  'Disaster Relief',
  'Animal Welfare',
  'Community',
]

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest'      },
  { value: 'most-funded', label: 'Most Funded'  },
  { value: 'ending-soon', label: 'Ending Soon'  },
  { value: 'most-donors', label: 'Most Donors'  },
]

const PAGE_SIZE = 6

export default function CampaignsPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [sort,     setSort]     = useState('newest')
  const [page,     setPage]     = useState(1)

  const filtered = useMemo(() => {
    let list = [...mockCampaigns].filter((c) => c.status === 'active')

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.title.toLowerCase().includes(q))
    }

    // category
    if (category && category !== 'All') {
      list = list.filter((c) => c.category === category)
    }

    // sort
    switch (sort) {
      case 'most-funded':
        list.sort((a, b) => b.raisedAmount - a.raisedAmount)
        break
      case 'ending-soon':
        list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
      case 'most-donors':
        list.sort((a, b) => b.donorCount - a.donorCount)
        break
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return list
  }, [search, category, sort])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch   = (val: string) => { setSearch(val);   setPage(1) }
  const handleCategory = (val: string) => { setCategory(val); setPage(1) }
  const handleSort     = (val: string) => { setSort(val);     setPage(1) }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">

        {/* Page header */}
        <section className="bg-emerald-50 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Explore Campaigns
            </h1>
            <p className="text-slate-500 text-base max-w-xl">
              Discover causes across Bangladesh and make a difference today.
              Every donation — big or small — creates real change.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8">

          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1">
              <SearchBar value={search} onChange={handleSearch} placeholder="Search campaigns…" />
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-6">
            <CategoryFilter
              categories={['All', ...CATEGORIES]}
              selected={category}
              onChange={handleCategory}
            />
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {paginated.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-800">{filtered.length}</span>{' '}
              campaign{filtered.length !== 1 ? 's' : ''}
            </p>
            {(search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); setPage(1) }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Clear filters ×
              </button>
            )}
          </div>

          {/* Campaign grid */}
          <CampaignGrid campaigns={paginated} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            </div>
          )}

        </section>
      </main>

      <Footer />
    </>
  )
}