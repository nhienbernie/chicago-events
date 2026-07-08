interface UserAvatarProps {
  username?: string | null
  displayName?: string | null
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
]

function getColor(name: string) {
  const index = name.charCodeAt(0) % COLORS.length
  return COLORS[index]
}

export default function UserAvatar({ username, displayName, avatarUrl, size = 'md' }: UserAvatarProps) {
  const name = username || displayName || '?'
  const initial = name.charAt(0).toUpperCase()
  const color = getColor(name)

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-3xl'
  }

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 80
  }

  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0`}>
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {initial}
    </div>
  )
}