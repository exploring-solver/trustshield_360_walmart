import { SignIn } from "@clerk/nextjs"
import { Shield, Lock, Zap, Eye, Brain, Database } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-900/50" />

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 pr-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TrustShield 360
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Next-Generation Retail Security</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <Lock className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quantum-Safe</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Post-quantum cryptography protection</p>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <Brain className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI-Powered</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Real-time fraud detection</p>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <Eye className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Vision Guard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">24/7 surveillance monitoring</p>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <Database className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Blockchain</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Immutable transaction logs</p>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">99.7%</div>
                <div className="text-sm opacity-90">Fraud Detection</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$2.3M</div>
                <div className="text-sm opacity-90">Fraud Prevented</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Protection</div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="border-l-4 border-blue-600 pl-4 italic text-slate-700 dark:text-slate-300">
            &quot;TrustShield 360 transforms security from a cost center to a competitive advantage—where every interaction
            gains cryptographic trust.&quot;
          </blockquote>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TrustShield 360
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Welcome back to the future of retail security</p>
            </div>

            {/* Sign In Component with Custom Styling */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome Back</h2>
                <p className="text-slate-600 dark:text-slate-400">Sign in to access your secure dashboard</p>
              </div>

              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
                    socialButtonsBlockButtonText: "font-medium",
                    dividerLine: "bg-slate-200 dark:bg-slate-700",
                    dividerText: "text-slate-500 dark:text-slate-400",
                    formFieldInput:
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                    formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5",
                    footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                    identityPreviewText: "text-slate-700 dark:text-slate-300",
                    identityPreviewEditButton: "text-blue-600 dark:text-blue-400",
                  },
                }}
              />
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Quantum-Safe Authentication</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your login is protected by post-quantum cryptography and zero-trust security protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-500" />
    </div>
  )
}
