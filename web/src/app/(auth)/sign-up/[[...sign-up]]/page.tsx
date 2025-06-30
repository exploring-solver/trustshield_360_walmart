import { SignUp } from "@clerk/nextjs"
import { Shield, Lock, Eye, Brain, Database, CheckCircle, Users, TrendingUp } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-900/50" />

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:block space-y-8 pr-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  TrustShield 360
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Join the Future of Retail Security</p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Why Choose TrustShield?</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Advanced Fraud Protection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    AI-powered detection with 99.7% accuracy rate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Quantum-Safe Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Future-proof encryption technology</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Real-time Monitoring</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">24/7 surveillance and threat detection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Blockchain Verification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Immutable transaction records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Trusted by Industry Leaders</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Users className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Active Users</div>
              </div>
              <div>
                <TrendingUp className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-xl font-bold">$50M+</div>
                <div className="text-sm opacity-90">Protected</div>
              </div>
              <div>
                <Shield className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-xl font-bold">99.9%</div>
                <div className="text-sm opacity-90">Uptime</div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50 text-center">
              <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">PQC Encryption</div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50 text-center">
              <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">AI Detection</div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50 text-center">
              <Eye className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Vision Guard</div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50 text-center">
              <Database className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Blockchain</div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  TrustShield 360
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Create your secure account today</p>
            </div>

            {/* Sign Up Component with Custom Styling */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Get Started</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Create your account and join thousands of protected users
                </p>
              </div>

              <SignUp
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
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500 dark:focus:ring-emerald-400",
                    formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                    formButtonPrimary:
                      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5",
                    footerActionLink:
                      "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
                    identityPreviewText: "text-slate-700 dark:text-slate-300",
                    identityPreviewEditButton: "text-emerald-600 dark:text-emerald-400",
                  },
                }}
              />
            </div>

            {/* Security & Privacy Notice */}
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                      Enterprise-Grade Security
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Your data is protected with military-grade encryption and zero-trust architecture.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                By signing up, you agree to our{" "}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-500" />
    </div>
  )
}
