interface SearchBarProps {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  price: string
  setPrice: (v: string) => void
}

export default function SearchBar({ search, setSearch, category, setCategory, price, setPrice }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
      <select
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Any Price</option>
        <option value="free">Free</option>
        <option value="10">Under $10</option>
        <option value="25">Under $25</option>
        <option value="50">Under $50</option>
      </select>
    </div>
  )
}