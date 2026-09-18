import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Lock, Mail, Eye, EyeOff, Building2, Shield, Users, Briefcase, Zap } from "lucide-react";
import apiClient from "@/services/api/axios";
import logoUrl from "@/assets/slblerp-logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Store tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));

      // Navigate to dashboard on successful login
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1816]">
      {/* Left Side - Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D4F4C] to-[#0B1816] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-[#10B981] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-[#10B981] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#10B981] rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt="SLBL ERP" className="h-12 w-12 rounded-xl object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-white">SLBL ERP</h1>
                <p className="text-sm text-[#829B96]">Sardar Landmark & Builders Ltd.</p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Enterprise Accounting<br />
                <span className="text-[#10B981]">Management System</span>
              </h2>
              <p className="text-lg text-[#829B96] leading-relaxed">
                Streamline your financial operations with our comprehensive ERP solution designed for real estate and construction businesses.
              </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Role-Based Access</h3>
                  <p className="text-sm text-[#829B96]">Secure user authentication</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">User Management</h3>
                  <p className="text-sm text-[#829B96]">Admin-controlled accounts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Multi-Module</h3>
                  <p className="text-sm text-[#829B96]">Complete business suite</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Real-Time Data</h3>
                  <p className="text-sm text-[#829B96]">Instant financial insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[#1E3E37]">
            <p className="text-sm text-[#829B96]">
              © 2026 Sardar Landmark & Builders Ltd. All rights reserved.
            </p>
            <p className="text-xs text-[#829B96] mt-2">
              Version 1.0.0 · Internal System
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoUrl} alt="SLBL ERP" className="h-10 w-10 rounded-lg object-contain" />
            <div>
              <h1 className="text-xl font-bold text-white">SLBL ERP</h1>
              <p className="text-xs text-[#829B96]">Sardar Landmark & Builders Ltd.</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-[#1E3E37] bg-[#112421] shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-sm text-[#829B96]">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Access Info */}
              <div className="mb-6 p-4 bg-[#0B1816] border border-[#1E3E37] rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium mb-1">
                      Role-Based Access Only
                    </p>
                    <p className="text-xs text-[#829B96]">
                      This system is restricted to authorized personnel. Contact your administrator for account access.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-xs font-medium text-[#829B96] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#829B96]" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="your.email@company.com"
                      autoComplete="username"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-[#0B1816] border-[#1E3E37] text-white placeholder:text-[#829B96]/50 focus:border-[#10B981] focus:ring-[#10B981]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-xs font-medium text-[#829B96] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#829B96]" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-[#0B1816] border-[#1E3E37] text-white placeholder:text-[#829B96]/50 focus:border-[#10B981] focus:ring-[#10B981]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#829B96] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div role="alert" aria-live="polite" className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-xs text-rose-400">{error}</p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="remember"
                      aria-label="Remember me"
                      autoComplete="off"
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#1E3E37] bg-[#0B1816] text-[#10B981] focus:ring-[#10B981] focus:ring-offset-0"
                    />
                    <span className="text-xs text-[#829B96]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#10B981] hover:text-[#0D9668] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold py-3 text-sm"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1E3E37]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#112421] text-[#829B96]">Internal System</span>
                </div>
              </div>

              {/* System Info */}
              <div className="space-y-2 text-center">
                <p className="text-xs text-[#829B96]">
                  Access is restricted to authorized employees only.
                </p>
                <p className="text-xs text-[#829B96]">
                  Please contact IT Administrator for account setup.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Footer */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-xs text-[#829B96]">
              © 2026 Sardar Landmark & Builders Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
