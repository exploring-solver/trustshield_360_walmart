import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-600 text-white">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-20 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center items-center lg:items-start space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Building Trust in Retail with Advanced Cybersecurity
                  </h1>
                  <p className="max-w-2xl text-gray-200 md:text-xl">
                    At Walmart, we are committed to protecting our customers and our business from the ever-evolving landscape of cyber threats.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-md bg-white text-blue-600 px-10 text-base font-semibold shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50"
                    href="#features"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <Image
                  alt="Threats Illustration"
                  className="aspect-video rounded-xl object-cover object-center shadow-md"
                  height={310}
                  src="/cybersec_illustration.jpg"
                  width={500}
                />
              </div>
            </div>
          </div>
        </section>
        {/* Threats Section */}
        <section id="threats" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-white">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 text-blue-700 px-4 py-1 text-sm font-medium">Key Cybersecurity Threats</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Cyber Battlefield in Retail</h2>
                <p className="max-w-3xl text-gray-600 md:text-xl">
                  The retail sector is a prime target for cybercriminals. Here are some of the most significant threats we face:
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-4xl items-center gap-10 py-12 lg:grid-cols-2 lg:gap-20">
              <div className="flex flex-col justify-center space-y-6">
                <ul className="grid gap-8">
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-blue-700">Credential Phishing</h3>
                      <p className="text-gray-600">
                        58% of attacks target login credentials, often via sophisticated phishing schemes.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-blue-700">Malware and Ransomware</h3>
                      <p className="text-gray-600">
                        These attacks disrupt operations and target sensitive payment/customer data.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-blue-700">DDoS Attacks</h3>
                      <p className="text-gray-600">
                        Aim to overwhelm retail networks, especially during peak seasons.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Threats Illustration"
                  className="aspect-video rounded-xl object-cover object-center shadow-md"
                  height={310}
                  src="/threat_illustration.jpg"
                  width={500}
                />
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 text-blue-700 px-4 py-1 text-sm font-medium">Cutting-Edge Technologies</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Approach to Cybersecurity</h2>
                <p className="max-w-3xl text-gray-600 md:text-xl">
                  We are investing in a multi-layered security strategy to protect our customers and our business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-10">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-700">AI-Driven Fraud Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We use AI and machine learning to analyze massive volumes of transaction data in real time, identifying anomalies and predicting fraud.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-700">Blockchain for Secure, Transparent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Blockchain provides a decentralized, tamper-proof ledger for all transactions, enhancing transparency and reducing fraud.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-700">Multi-Factor Authentication (MFA) &amp; Biometric Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We are implementing MFA and biometric security to add an extra layer of protection to customer accounts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="w-full flex justify-center py-12 md:py-24 lg:py-32 border-t bg-white">
          <div className="w-full max-w-2xl grid items-center justify-center gap-6 px-4 text-center md:px-8 mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Building a more secure future for retail.
              </h2>
              <p className="mx-auto max-w-xl text-gray-600 md:text-xl">
                We are committed to protecting our customers and our business from the ever-evolving landscape of cyber threats.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}   