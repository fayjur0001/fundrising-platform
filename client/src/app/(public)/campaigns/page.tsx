// src/app/(public)/campaigns/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CampaignGrid from '@/components/campaign/CampaignGrid'
import SearchBar from '@/components/campaign/SearchBar'
import CategoryFilter from '@/components/campaign/CategoryFilter'
import Pagination from '@/components/ui/pagination'
import { campaignApi } from '@/lib/api'
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

  const [campaigns,   setCampaigns]   = useState<unknown[]>([])
  const [total,       setTotal]       = useState(0)
  const [isLoading,   setIsLoading]   = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fetchCampaigns = useCallback(() => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('page',   String(page))
    params.set('limit',  String(PAGE_SIZE))
    params.set('status', 'active')
    if (search.trim())       params.set('search',   search.trim())
    if (category !== 'All')  params.set('category', category)
    params.set('sort', sort)

    campaignApi.getAll(params.toString())
      .then((res: any) => {
        if (res.success) {
          setCampaigns(res.data)
          setTotal(res.meta?.total ?? res.data.length)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [search, category, sort, page])

  useEffect(() => { fetchCampaigns() }, [fetchCampaigns])

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
              {isLoading ? 'Loading…' : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-slate-800">
                    {campaigns.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-800">{total}</span>{' '}
                  campaign{total !== 1 ? 's' : ''}
                </>
              )}
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
          <CampaignGrid campaigns={campaigns} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
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