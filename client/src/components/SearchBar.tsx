export default function SearchBar({ search, setSearch, category, setCategory }: {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="music">🎵 Music</option>
        <option value="theatre">🎭 Theatre</option>
        <option value="sports">⚽ Sports</option>
        <option value="arts">🎨 Arts</option>
        <option value="thrifting">🛍️ Thrifting</option>
        <option value="film">🎬 Film</option>
      </select>
    </div>
  )
}