import { Shield, Sun, Moon } from 'lucide-react'

export default function Header({ connected, modelLoaded, alertCount, activeTab, setActiveTab, theme, toggleTheme }) {
  const isLight = theme === 'light'

  return (
    <div className="fixed top-4 inset-x-[9%] z-50">

      {/* Ambient glow beneath */}
      <div className="pointer-events-none absolute -bottom-4 left-1/4 right-1/4 h-8
                      bg-violet-600/18 blur-3xl rounded-full" />

      {/* ── Animated shimmer border shell ── */}
      <div className="navbar-shell rounded-[32px] p-[1px]">

        {/* ── Glass body ── */}
        <header
          className="relative h-[72px] flex items-center px-8 gap-3
                     rounded-[31px] overflow-hidden backdrop-blur-[64px]"
          style={{ backgroundColor: isLight ? 'rgba(22,8,48,0.96)' : 'rgba(7,6,15,0.95)' }}
        >

          {/* Grain texture */}
          <div className="navbar-noise pointer-events-none absolute inset-0" />

          {/* Top shimmer edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px
                          bg-gradient-to-r from-transparent via-violet-400/55 to-transparent" />

          {/* Subtle inner violet-to-blue diagonal wash */}
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br
                           ${isLight
                             ? 'from-violet-500/[0.12] via-transparent to-cyan-600/[0.07]'
                             : 'from-violet-600/[0.06] via-transparent to-blue-600/[0.04]'}`} />

          {/* ══ LOGO ══════════════════════════════════════════════════════════ */}
          <button
            onClick={() => setActiveTab('Landing')}
            className="group relative flex items-center gap-2.5 shrink-0"
          >
            {/* Halo pulse */}
            <div className="navbar-logo-glow absolute left-0 top-1/2 -translate-y-1/2
                            h-[36px] w-[36px] rounded-[10px] bg-violet-500/30 blur-[12px]" />

            {/* Icon cube — violet → purple → cyan */}
            <div className="relative flex h-[36px] w-[36px] shrink-0 items-center justify-center
                            rounded-[10px]
                            bg-gradient-to-br from-violet-500 via-purple-600 to-cyan-500
                            shadow-[0_0_18px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]
                            group-hover:shadow-[0_0_28px_rgba(139,92,246,0.80),inset_0_1px_0_rgba(255,255,255,0.25)]
                            group-hover:scale-[1.07] transition-all duration-200">
              <Shield className="h-[15px] w-[15px] text-white drop-shadow-sm" />
            </div>

            {/* Brand text + subtitle */}
            <div className="flex flex-col justify-center gap-[3px]">
              <span className="text-[14.5px] font-black tracking-[-0.03em] leading-none">
                <span className="text-white/90 group-hover:text-white transition-colors duration-150">Safe</span>
                <span className="navbar-brand">Aura</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-[1px] w-3 rounded-full
                                bg-gradient-to-r from-violet-400/60 to-cyan-400/30" />
                <span className="text-[8px] font-bold tracking-[0.12em] uppercase text-white/50">
                  Women's Safety AI
                </span>
              </div>
            </div>
          </button>

          {/* Hairline divider */}
          <div className="h-4 w-px shrink-0 bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />

          {/* ══ NAV TABS — absolutely centred ═════════════════════════════════ */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
            {[
              { label: 'Home',    tab: 'Landing' },
              { label: 'Monitor', tab: 'Monitor' },
              { label: 'Alerts',  tab: 'Alerts'  },
              { label: 'About',   tab: 'About'   },
              { label: 'Contact',  tab: 'Contact'  },
              { label: 'Feedback', tab: 'Feedback' },
            ].map(({ label, tab }) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`group relative flex items-center gap-1.5
                              px-3 py-[7px] rounded-[9px]
                              text-[11.5px] font-bold tracking-[0.05em] uppercase
                              transition-all duration-200 select-none
                              ${tab === 'Contact' && !isActive
                                ? 'text-cyan-300/80 hover:text-cyan-200'
                                : isActive ? 'text-white' : 'text-white/35 hover:text-white/80'}`}
                >
                  {/* Active fill */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-[9px]
                                     bg-gradient-to-r from-violet-600/30 to-blue-600/20
                                     shadow-[inset_0_0_0_1px_rgba(139,92,246,0.40),inset_0_1px_0_rgba(255,255,255,0.08)]" />
                  )}

                  {/* Contact highlight pill */}
                  {tab === 'Contact' && !isActive && (
                    <span className="absolute inset-0 rounded-[9px]
                                     bg-cyan-500/10 border border-cyan-500/25
                                     group-hover:bg-cyan-500/15 group-hover:border-cyan-400/40
                                     transition-all duration-200" />
                  )}

                  {/* Hover fill (other tabs) */}
                  {tab !== 'Contact' && !isActive && (
                    <span className="absolute inset-0 rounded-[9px] opacity-0
                                     group-hover:opacity-100 transition-opacity duration-200
                                     bg-white/[0.05]" />
                  )}

                  {/* Bottom glow bar */}
                  <span className={`absolute bottom-[2px] left-3 right-3 h-[1.5px] rounded-full
                                    transition-all duration-300
                                    ${isActive
                                      ? 'opacity-100 bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400'
                                      : 'opacity-0 group-hover:opacity-25 bg-white'}`} />

                  <span className="relative z-10">{label}</span>

                  {tab === 'Alerts' && alertCount > 0 && (
                    <span className={`relative z-10 flex h-[14px] min-w-[14px] items-center
                                      justify-center rounded-full px-[3px] text-[8.5px] font-black
                                      transition-all duration-200
                                      ${isActive
                                        ? 'bg-violet-500/50 text-violet-100 border border-violet-400/40'
                                        : 'bg-violet-500 text-white shadow-[0_0_6px_rgba(139,92,246,0.8)]'}`}>
                      {alertCount > 99 ? '99+' : alertCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ══ RIGHT CONTROLS ════════════════════════════════════════════════ */}
          <div className="flex items-center gap-1 shrink-0">

            {/* AI model pill */}
            <div className={`hidden lg:flex items-center gap-1.5 px-2 py-[4px]
                             rounded-lg border text-[10px] font-bold tracking-[0.05em] uppercase
                             transition-all duration-300
                             ${modelLoaded
                               ? 'border-cyan-500/25 bg-cyan-500/[0.08] text-cyan-400'
                               : 'border-amber-500/25 bg-amber-500/[0.08] text-amber-400 animate-pulse'}`}>
              <span className={`h-[5px] w-[5px] rounded-full shrink-0
                                ${modelLoaded
                                  ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]'
                                  : 'bg-amber-400'}`} />
              <span>{modelLoaded ? 'AI Ready' : 'Loading'}</span>
            </div>

            {/* Live / Offline pill */}
            <div className={`flex items-center gap-1.5 px-2 py-[4px]
                             rounded-lg border text-[10px] font-bold tracking-[0.05em] uppercase
                             transition-all duration-300
                             ${connected
                               ? 'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400'
                               : 'border-red-500/25 bg-red-500/[0.08] text-red-400'}`}>
              <span className="relative flex h-[5px] w-[5px] shrink-0">
                {connected && (
                  <span className="absolute inline-flex h-full w-full animate-ping
                                   rounded-full bg-emerald-400 opacity-70" />
                )}
                <span className={`relative flex h-[5px] w-[5px] rounded-full
                                  ${connected
                                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                                    : 'bg-red-500'}`} />
              </span>
              <span className="hidden sm:inline">{connected ? 'Live' : 'Off'}</span>
            </div>

            {/* Divider */}
            <div className="mx-1 h-4 w-px bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="group relative flex h-[36px] w-[36px] items-center justify-center
                         rounded-[11px] border border-violet-500/40
                         bg-gradient-to-br from-violet-600/25 via-purple-600/15 to-cyan-500/10
                         text-white/80
                         shadow-[0_0_12px_rgba(139,92,246,0.28),inset_0_1px_0_rgba(255,255,255,0.10)]
                         hover:border-violet-400/65 hover:text-white hover:scale-[1.10]
                         hover:shadow-[0_0_22px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]
                         hover:from-violet-600/35 hover:to-cyan-500/20
                         transition-all duration-200"
            >
              {theme === 'dark'
                ? <Sun  className="h-[14px] w-[14px] group-hover:rotate-45  transition-transform duration-500" />
                : <Moon className="h-[14px] w-[14px] group-hover:-rotate-12 transition-transform duration-300" />}
            </button>

          </div>
        </header>
      </div>
    </div>
  )
}
