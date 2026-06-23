import React from 'react';

export type IllustrationType = 
  | 'bed-to-wheelchair'
  | 'wheelchair-to-bed'
  | 'wheelchair-to-toilet'
  | 'bed-to-chair'
  | 'caregiver-assist'
  | 'safety-check'
  | 'dizzy-warning'
  | 'express-need'
  | 'move-difficulty'
  | 'bedside-toileting'
  | 'clean-after'
  | 'caregiver-prep'
  | 'privacy-protection'
  | 'hygiene-manage';

interface CareSceneIllustrationProps {
  type: IllustrationType;
  size?: 'sm' | 'md' | 'lg';
}

export default function CareSceneIllustration({ type, size = 'md' }: CareSceneIllustrationProps) {
  const getDimensionClass = () => {
    switch (size) {
      case 'sm':
        return 'h-28 w-full max-w-sm mx-auto';
      case 'lg':
        return 'h-52 w-full max-w-lg mx-auto';
      case 'md':
      default:
        return 'h-40 w-full max-w-md mx-auto';
    }
  };

  const renderSVG = () => {
    switch (type) {
      case 'bed-to-wheelchair':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-btw" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5F3FF" />
                <stop offset="1" stopColor="#EDE9FE" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-btw)" />
            {/* Bed on the left */}
            <rect x="25" y="65" width="60" height="30" rx="4" fill="#93C5FD" />
            <rect x="25" y="60" width="15" height="8" rx="2" fill="#DBEAFE" />
            <path d="M40 55 C48 55, 48 65, 60 65 L85 65 L85 75 L40 75 Z" fill="#60A5FA" />
            <rect x="30" y="95" width="6" height="10" fill="#4B5563" />
            <rect x="74" y="95" width="6" height="10" fill="#4B5563" />
            {/* Arrow in middle */}
            <path d="M105 70 H130 M124 64 L131 70 L124 76" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="118" y="52" fill="#4F46E5" fontSize="10" fontWeight="900" textAnchor="middle">이동</text>
            {/* Wheelchair on the right */}
            <circle cx="170" cy="85" r="16" stroke="#4B5563" strokeWidth="4" />
            <circle cx="170" cy="85" r="10" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M152 50 H165 V78 H182" stroke="#374151" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Person sitting in wheelchair */}
            <circle cx="165" cy="38" r="6" fill="#818CF8" />
            <path d="M165 44 C172 44, 176 50, 176 58 L170 70" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="190" cy="92" r="5" fill="#4B5563" />
          </svg>
        );

      case 'wheelchair-to-bed':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-wtb" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EFF6FF" />
                <stop offset="1" stopColor="#DBEAFE" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-wtb)" />
            {/* Wheelchair on the left */}
            <circle cx="65" cy="85" r="16" stroke="#4B5563" strokeWidth="4" />
            <path d="M47 50 H60 V78 H77" stroke="#374151" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="38" r="6" fill="#60A5FA" />
            <path d="M60 44 C67 44, 71 50, 71 58 L65 70" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
            <circle cx="85" cy="92" r="5" fill="#4B5563" />
            {/* Arrow in middle */}
            <path d="M105 70 H130 M124 64 L131 70 L124 76" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Bed on the right */}
            <rect x="155" y="65" width="60" height="30" rx="4" fill="#93C5FD" />
            <rect x="155" y="60" width="15" height="8" rx="2" fill="#DBEAFE" />
            <path d="M170 55 C178 55, 178 65, 190 65 L215 65 L215 75 L170 75 Z" fill="#2563EB" />
            <rect x="160" y="95" width="6" height="10" fill="#4B5563" />
            <rect x="204" y="95" width="6" height="10" fill="#4B5563" />
          </svg>
        );

      case 'wheelchair-to-toilet':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-wtt" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5F3FF" />
                <stop offset="1" stopColor="#FAE8FF" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-wtt)" />
            {/* Wheelchair on the left */}
            <circle cx="60" cy="85" r="16" stroke="#4B5563" strokeWidth="4" />
            <path d="M42 50 H55 V78 H72" stroke="#374151" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="55" cy="38" r="6" fill="#818CF8" />
            <circle cx="80" cy="92" r="5" fill="#4B5563" />
            {/* Arrow in middle */}
            <path d="M105 70 H130 M124 64 L131 70 L124 76" stroke="#A21CAF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Toilet on the right */}
            <path d="M165 40 H185 V65 H165 Z" fill="#D1D5DB" />
            <path d="M160 65 H195 V80 C195 90, 185 95, 177 95 H172 C164 95, 160 90, 160 80 Z" fill="#E5E7EB" />
            <ellipse cx="177" cy="65" rx="15" ry="4" fill="#9CA3AF" />
            <rect x="180" y="30" width="10" height="10" rx="2" fill="#9CA3AF" />
          </svg>
        );

      case 'bed-to-chair':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-btc" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EFF6FF" />
                <stop offset="1" stopColor="#ECFDF5" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-btc)" />
            {/* Bed on left */}
            <rect x="25" y="65" width="60" height="30" rx="4" fill="#93C5FD" />
            <rect x="25" y="60" width="15" height="8" rx="2" fill="#DBEAFE" />
            <rect x="30" y="95" width="6" height="10" fill="#4B5563" />
            <rect x="74" y="95" width="6" height="10" fill="#4B5563" />
            {/* Arrow */}
            <path d="M105 70 H130 M124 64 L131 70 L124 76" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Chair on right */}
            <path d="M165 45 H180 V70 H165 Z" fill="#A7F3D0" />
            <path d="M160 70 H185 V75 H160 Z" fill="#059669" />
            <rect x="163" y="75" width="4" height="20" fill="#374151" />
            <rect x="178" y="75" width="4" height="20" fill="#374151" />
            <path d="M160 45 V70" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'caregiver-assist':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-ca" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EEF2F6" />
                <stop offset="1" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-ca)" />
            {/* Caregiver (left/taller) */}
            <circle cx="105" cy="40" r="10" fill="#4F46E5" />
            <path d="M90 65 C90 55, 120 55, 120 65 V105 H108 V80 H102 V105 H90 Z" fill="#4F46E5" />
            {/* Recipient (right/shorter) */}
            <circle cx="135" cy="50" r="8" fill="#EC4899" />
            <path d="M123 70 C123 62, 147 62, 147 70 V105 H138 V85 H132 V105 H123 Z" fill="#EC4899" />
            {/* Heart symbol of care */}
            <path d="M120 28 C120 28, 117 24, 114 26 C111 28, 113 32, 120 36 C127 32, 129 28, 126 26 C123 24, 120 28, 120 28 Z" fill="#EF4444" />
          </svg>
        );

      case 'safety-check':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-sc" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF3C7" />
                <stop offset="1" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-sc)" />
            {/* Wheel Lock Illustration */}
            <circle cx="120" cy="60" r="32" stroke="#4B5563" strokeWidth="6" fill="#F3F4F6" />
            <circle cx="120" cy="60" r="22" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="6 4" />
            {/* Red Lock lever */}
            <path d="M96 35 L116 55" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
            <circle cx="96" cy="35" r="6" fill="#DC2626" />
            {/* Safe Lock text badge */}
            <rect x="100" y="82" width="40" height="14" rx="7" fill="#10B981" />
            <path d="M115 89 L118 92 L125 86" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'dizzy-warning':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-dw" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFE4E6" />
                <stop offset="1" stopColor="#FECDD3" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-dw)" />
            {/* Person dizzy head outline */}
            <circle cx="120" cy="65" r="20" stroke="#E11D48" strokeWidth="4" fill="white" />
            {/* Dizzy spirals */}
            <path d="M108 35 C112 30, 120 30, 124 35 C128 40, 120 45, 126 48" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M125 28 C129 23, 137 23, 141 28" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Big Alert Icon */}
            <path d="M120 52 V68 M120 76 H120.01" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'express-need':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-en" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5F3FF" />
                <stop offset="1" stopColor="#E0F2FE" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-en)" />
            {/* Person showing express expression */}
            <circle cx="80" cy="65" r="16" fill="#818CF8" />
            <path d="M68 95 C68 85, 92 85, 92 95 Z" fill="#818CF8" />
            {/* Talk bubble */}
            <path d="M120 35 H180 C188 35, 192 40, 192 48 V65 C192 73, 188 78, 180 78 H140 L125 90 L132 78 H120 C112 78, 108 73, 108 65 V48 C108 40, 112 35, 120 35 Z" fill="white" stroke="#3B82F6" strokeWidth="2" />
            <text x="150" y="58" fill="#1E40AF" fontSize="11" fontWeight="900" textAnchor="middle">화장실 가고 싶어요</text>
          </svg>
        );

      case 'move-difficulty':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-md" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F1F5F9" />
                <stop offset="1" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-md)" />
            {/* Footprints showing slip/stumble */}
            <ellipse cx="85" cy="75" rx="7" ry="12" fill="#94A3B8" transform="rotate(-25 85 75)" />
            <ellipse cx="115" cy="55" rx="7" ry="12" fill="#94A3B8" transform="rotate(15 115 55)" />
            {/* Slippery wave indicator */}
            <path d="M75 95 Q100 85, 125 95 T175 95" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            {/* Alert sign */}
            <path d="M150 40 L170 75 H130 Z" fill="#EF4444" />
            <path d="M150 50 V62 M150 68 H150.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'bedside-toileting':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-bt" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EFF6FF" />
                <stop offset="1" stopColor="#F5F3FF" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-bt)" />
            {/* Bed part */}
            <rect x="25" y="65" width="75" height="30" rx="4" fill="#93C5FD" />
            <rect x="25" y="60" width="15" height="8" rx="2" fill="#DBEAFE" />
            {/* Bedside Commode Toilet */}
            <rect x="145" y="60" width="35" height="35" rx="6" fill="#C084FC" />
            <rect x="140" y="55" width="45" height="6" rx="3" fill="#E9D5FF" />
            <path d="M148 55 V85 M177 55 V85" stroke="#7E22CE" strokeWidth="3" />
            <circle cx="162" cy="77" r="10" fill="#7E22CE" />
          </svg>
        );

      case 'clean-after':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-caft" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ECFDF5" />
                <stop offset="1" stopColor="#D1FAE5" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-caft)" />
            {/* Water bubbles & sparkles */}
            <circle cx="85" cy="55" r="10" fill="#3B82F6" opacity="0.6" />
            <circle cx="105" cy="75" r="14" fill="#60A5FA" opacity="0.5" />
            <circle cx="135" cy="45" r="8" fill="#93C5FD" opacity="0.7" />
            <path d="M150 65 L155 75 L165 70 L157 82 L165 92 L155 87 L150 97 L145 87 L135 92 L143 82 L135 70 L145 75 Z" fill="#F59E0B" />
            {/* Big green check */}
            <circle cx="120" cy="60" r="24" fill="#10B981" />
            <path d="M110 60 L117 67 L130 52" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'caregiver-prep':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-cgp" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0FDFA" />
                <stop offset="1" stopColor="#CCFBF1" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-cgp)" />
            {/* Caregiver explaining */}
            <circle cx="95" cy="45" r="10" fill="#0D9488" />
            <path d="M80 70 C80 60, 110 60, 110 70 V100 H80 Z" fill="#0D9488" />
            {/* Recipient smiling */}
            <circle cx="145" cy="55" r="8" fill="#0F766E" />
            <path d="M133 78 C133 70, 157 70, 157 78 V100 H133 Z" fill="#0F766E" />
            {/* Explanation lines */}
            <path d="M115 50 Q122 45, 130 50" stroke="#0D9488" strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
          </svg>
        );

      case 'privacy-protection':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-pp" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5F3FF" />
                <stop offset="1" stopColor="#E9D5FF" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-pp)" />
            {/* Partition Screen */}
            <rect x="75" y="35" width="10" height="70" rx="2" fill="#7E22CE" />
            <rect x="90" y="30" width="12" height="75" rx="2" fill="#9333EA" />
            <rect x="107" y="35" width="10" height="70" rx="2" fill="#7E22CE" />
            {/* Hidden toilet behind screen */}
            <rect x="145" y="60" width="30" height="30" rx="4" fill="#D1D5DB" opacity="0.6" />
            {/* Eye cover icon representing privacy */}
            <path d="M135 48 C145 42, 165 42, 175 48" stroke="#7E22CE" strokeWidth="3" strokeLinecap="round" />
            <path d="M142 55 L138 60 M155 56 L155 62 M168 55 L172 60" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'hygiene-manage':
        return (
          <svg className="w-full h-full" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-hm" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0FDF4" />
                <stop offset="1" stopColor="#DCFCE7" />
              </linearGradient>
            </defs>
            <rect width="240" height="120" rx="20" fill="url(#bg-hm)" />
            {/* Clean sparkles */}
            <path d="M120 40 L123 48 L131 51 L123 54 L120 62 L117 54 L109 51 L117 48 Z" fill="#34D399" />
            <path d="M150 65 L152 70 L157 72 L152 74 L150 79 L148 74 L143 72 L148 70 Z" fill="#34D399" opacity="0.8" />
            {/* Disinfected garbage bin or device */}
            <rect x="80" y="50" width="28" height="40" rx="4" fill="#65A30D" />
            <rect x="76" y="45" width="36" height="6" rx="2" fill="#84CC16" />
            {/* Check overlay */}
            <circle cx="120" cy="80" r="16" fill="#15803D" />
            <path d="M113 80 L118 85 L127 74" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${getDimensionClass()} shrink-0 overflow-hidden flex items-center justify-center p-1 rounded-2xl`}>
      {renderSVG()}
    </div>
  );
}
