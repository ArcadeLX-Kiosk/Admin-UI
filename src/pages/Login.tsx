import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/authContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Building2, Store, User } from 'lucide-react';

import logo from '../assets/BannerNoBg.png'
import backgroundImage from '../assets/LoginPageBG.jpeg';

export function Login() {
  const { loginAsRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const handleLogin = (role: 'company' | 'distributor' | 'partner') => {
    loginAsRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#08051c] p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay - keeps the background visible while improving readability */}
      <div className="absolute inset-0 bg-[#08051c]/30" />

      {/* Subtle right-side gradient behind the login card */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#08051c]/75 via-[#08051c]/20 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-[12%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#7c2cff]/10 blur-[120px]" />

      {/* Login area */}
      {/* Login area */}
<div className="relative z-10 flex min-h-[calc(100vh-2rem)] items-center justify-center lg:translate-x-[8%]">
  <Card
    className="
      w-full max-w-md
      overflow-hidden
      border border-white/10
      bg-[#0d0924]/75
      text-white
      shadow-[0_0_60px_rgba(126,34,206,0.18)]
      backdrop-blur-2xl
    "
  >
          {/* Top neon line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#00e5ff] via-[#147bff] to-[#ff00c8]" />

          <CardHeader className="space-y-5 px-7 pb-5 pt-8 text-center sm:px-9">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#00d9ff]/10 blur-2xl" />

                <img
                  src={logo}
                  alt="ARCADE LX"
                  className="
                    relative
                    h-auto
                    w-[175px]
                    object-contain
                    drop-shadow-[0_0_18px_rgba(0,217,255,0.18)]
                  "
                />
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-white">
                Kiosk Management Platform
              </CardTitle>

              <p className="text-sm text-slate-400">
                Select your access portal to continue
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 px-7 pb-8 sm:px-9">
            {/* Company */}
            <Button
              className="
                group
                relative
                h-14
                w-full
                justify-start
                overflow-hidden
                border
                border-[#00d9ff]/20
                bg-white/[0.04]
                text-base
                text-slate-100
                transition-all
                duration-300
                hover:border-[#00d9ff]/60
                hover:bg-[#00d9ff]/10
                hover:shadow-[0_0_25px_rgba(0,217,255,0.12)]
              "
              variant="outline"
              onClick={() => handleLogin('company')}
            >
              <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#00e5ff] to-[#147bff]" />

              <span className="ml-1 mr-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#00d9ff]/20 bg-[#00d9ff]/10">
                <Building2 className="h-5 w-5 text-[#00d9ff]" />
              </span>

              <span className="flex flex-col items-start">
                <span className="font-medium">Continue as Company</span>
                <span className="text-xs text-slate-500">
                  Manage your kiosk network
                </span>
              </span>

              <span className="ml-auto pr-2 text-slate-600 transition-colors group-hover:text-[#00d9ff]">
                →
              </span>
            </Button>

            {/* Distributor */}
            <Button
              className="
                group
                relative
                h-14
                w-full
                justify-start
                overflow-hidden
                border
                border-[#7c3cff]/20
                bg-white/[0.04]
                text-base
                text-slate-100
                transition-all
                duration-300
                hover:border-[#a855f7]/60
                hover:bg-[#7c3cff]/10
                hover:shadow-[0_0_25px_rgba(139,43,255,0.14)]
              "
              variant="outline"
              onClick={() => handleLogin('distributor')}
            >
              <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#147bff] to-[#a855f7]" />

              <span className="ml-1 mr-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/10">
                <Store className="h-5 w-5 text-[#9b6cff]" />
              </span>

              <span className="flex flex-col items-start">
                <span className="font-medium">Continue as Distributor</span>
                <span className="text-xs text-slate-500">
                  Manage distribution operations
                </span>
              </span>

              <span className="ml-auto pr-2 text-slate-600 transition-colors group-hover:text-[#a855f7]">
                →
              </span>
            </Button>

            {/* Partner */}
            <Button
              className="
                group
                relative
                h-14
                w-full
                justify-start
                overflow-hidden
                border
                border-[#ff00c8]/20
                bg-white/[0.04]
                text-base
                text-slate-100
                transition-all
                duration-300
                hover:border-[#ff00c8]/60
                hover:bg-[#ff00c8]/10
                hover:shadow-[0_0_25px_rgba(255,0,200,0.14)]
              "
              variant="outline"
              onClick={() => handleLogin('partner')}
            >
              <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff00c8] to-[#9b2cff]" />

              <span className="ml-1 mr-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#ff00c8]/20 bg-[#ff00c8]/10">
                <User className="h-5 w-5 text-[#ff35d3]" />
              </span>

              <span className="flex flex-col items-start">
                <span className="font-medium">Continue as Partner</span>
                <span className="text-xs text-slate-500">
                  Access partner services
                </span>
              </span>

              <span className="ml-auto pr-2 text-slate-600 transition-colors group-hover:text-[#ff00c8]">
                →
              </span>
            </Button>

            {/* Footer */}
            <div className="pt-4 text-center">
              <div className="mx-auto mb-3 h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
                Powered by ARCADE LX
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}