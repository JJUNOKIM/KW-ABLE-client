import ChangeEachIcon from '@/assets/icons/icons_changeEach.svg'

interface DualSearchBarProps {
  startValue?: string
  endValue?: string
  onStartChange?: (value: string) => void
  onEndChange?: (value: string) => void
  onStartClick?: () => void
  onEndClick?: () => void
  onSwap?: () => void
  onAddWaypoint?: () => void
}

export const DualSearchBar = ({
  startValue = '',
  endValue = '',
  onStartClick,
  onEndClick,
  onSwap,
  onAddWaypoint,
}: DualSearchBarProps) => {
  return (
    <div className="relative shadow-md">
      <div className="py-3 space-y-2">
        <div
          onClick={onStartClick}
          style={{ backgroundColor: '#672424' }}
          className="flex items-center gap-2 rounded-lg px-4 py-3 cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#536DFE' }} />
          <input
            type="text"
            value={startValue}
            placeholder="  출발지 입력"
            readOnly
            style={{ backgroundColor: '#672424' }}
            className="flex-1 outline-none text-sm text-white placeholder-white/70 cursor-pointer"
          />
        </div>

        <div
          onClick={onEndClick}
          style={{ backgroundColor: '#672424' }}
          className="flex items-center gap-2 rounded-lg px-4 py-3 cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#501B1B' }} />
          <input
            type="text"
            value={endValue}
            placeholder="  도착지 입력"
            readOnly
            style={{ backgroundColor: '#672424' }}
            className="flex-1 outline-none text-sm text-white placeholder-white/70 cursor-pointer"
          />
        </div>
      </div>

      {onSwap && (
        <button
          onClick={onSwap}
          className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center"
          aria-label="출발/도착 바꾸기"
        >
          <img src={ChangeEachIcon} alt="교체" width={28} height={28} />
        </button>
      )}

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2" style={{ display: 'none' }}>
        {onAddWaypoint && (
          <button
            onClick={onAddWaypoint}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
            aria-label="경유지 추가"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
