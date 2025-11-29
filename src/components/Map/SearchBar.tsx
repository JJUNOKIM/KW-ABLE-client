import { useState, memo } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onFocus?: () => void
  onBack?: () => void
  showBackButton?: boolean
  value?: string
  onChange?: (value: string) => void
}

export const SearchBar = memo(({
  placeholder = '내 주변 건물을 검색해보세요 !',
  onSearch,
  onFocus,
  onBack,
  showBackButton = false,
  value,
  onChange,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-3">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="flex-shrink-0 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div className="flex items-center flex-1 gap-2">
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={onFocus}
            placeholder={placeholder}
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  )
})
