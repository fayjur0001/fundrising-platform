// src/app/(dashboard)/admin/users/page.tsx
'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import { mockUsers } from '@/lib/mockData'
import type { User } from '@/lib/mockData'
import { Search, ChevronLeft, ChevronRight, Eye, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react'

const PAGE_SIZE = 5

type RoleFilter = 'all' | 'donor' | 'creator' | 'admin'
type StatusFilter = 'all' | 'active' | 'banned'

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  creator: 'bg-emerald-100 text-emerald-700',
  donor: 'bg-blue-100 text-blue-700',
}

const avatarColors = [
  'bg-emerald-500', 'bg-violet-500', 'bg-blue-500',
  'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500',
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const [banTarget, setBanTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase()
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !u.isBanned) ||
        (statusFilter === 'banned' && u.isBanned)
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => { setSearch(val); setPage(1) }
  const handleRoleFilter = (val: RoleFilter) => { setRoleFilter(val); setPage(1) }
  const handleStatusFilter = (val: StatusFilter) => { setStatusFilter(val); setPage(1) }

  const handleToggleBan = () => {
    if (!banTarget) return
    setUsers((prev) => prev.map((u) => u.id === banTarget.id ? { ...u, isBanned: !u.isBanned } : u))
    setBanTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    setDeleteTarget(null)
    if (paginated.length === 1 && page > 1) setPage((p) => p - 1)
  }

  const roleCounts: Record<RoleFilter, number> = {
    all: users.length,
    donor: users.filter((u) => u.role === 'donor').length,
    creator: users.filter((u) => u.role === 'creator').length,
    admin: users.filter((u) => u.role === 'admin').length,
  }

  return (
    <DashboardLayout role="admin">
      <PageHeader title="Users" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
          {(['all', 'donor', 'creator', 'admin'] as RoleFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize whitespace-nowrap ${
                roleFilter === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r === 'all' ? 'All' : r}
              <span className={`ml-1 ${roleFilter === r ? 'text-emerald-600' : 'text-slate-400'}`}>
                {roleCounts[r]}
              </span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value as StatusFilter)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table or Empty */}
      {filtered.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((u, idx) => {
                    const initials = u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    const avatarBg = avatarColors[idx % avatarColors.length]
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                              <span className="text-xs font-bold text-white">{initials}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 whitespace-nowrap">{u.name}</p>
                              {u.isVerified && (
                                <span className="text-[10px] text-emerald-500 font-medium">Verified</span>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{u.email}</td>
                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.isBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {u.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        {/* Joined */}
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="View"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title={u.isBanned ? 'Unban' : 'Ban'}
                              onClick={() => setBanTarget(u)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.isBanned
                                  ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                  : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              }`}
                            >
                              {u.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                            </button>
                            <button
                              title="Delete"
                              onClick={() => setDeleteTarget(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
              </p>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? 'bg-emerald-600 text-white' : 'border border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Ban / Unban Confirm */}
      <ConfirmDialog
        open={!!banTarget}
        title={banTarget?.isBanned ? 'Unban User' : 'Ban User'}
        description={
          banTarget?.isBanned
            ? `Are you sure you want to unban "${banTarget?.name}"? They will regain access to the platform.`
            : `Are you sure you want to ban "${banTarget?.name}"? They will lose access to the platform.`
        }
        confirmLabel={banTarget?.isBanned ? 'Unban' : 'Ban'}
        variant={banTarget?.isBanned ? 'default' : 'danger'}
        onConfirm={handleToggleBan}
        onCancel={() => setBanTarget(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  )
}