import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-primary text-primary-foreground">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-20 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center items-center lg:items-start space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Building Trust in Retail with Advanced Cybersecurity
                  </h1>
                  <p className="max-w-2xl text-primary-foreground/80 md:text-xl">
                    At Walmart, we are committed to protecting our customers and our business from the ever-evolving landscape of cyber threats.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary-foreground text-primary px-10 text-base font-semibold shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
        <section id="threats" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-background">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 text-primary px-4 py-1 text-sm font-medium">Key Cybersecurity Threats</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Cyber Battlefield in Retail</h2>
                <p className="max-w-3xl text-muted-foreground md:text-xl">
                  The retail sector is a prime target for cybercriminals. Here are some of the most significant threats we face:
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-4xl items-center gap-10 py-12 lg:grid-cols-2 lg:gap-20">
              <div className="flex flex-col justify-center space-y-6">
                <ul className="grid gap-8">
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-primary">Credential Phishing</h3>
                      <p className="text-muted-foreground">
                        58% of attacks target login credentials, often via sophisticated phishing schemes.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-primary">Malware and Ransomware</h3>
                      <p className="text-muted-foreground">
                        These attacks disrupt operations and target sensitive payment/customer data.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold text-primary">DDoS Attacks</h3>
                      <p className="text-muted-foreground">
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
        <section id="features" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-muted">
          <div className="w-full max-w-6xl px-4 md:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 text-primary px-4 py-1 text-sm font-medium">Cutting-Edge Technologies</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Approach to Cybersecurity</h2>
                <p className="max-w-3xl text-muted-foreground md:text-xl">
                  We are investing in a multi-layered security strategy to protect our customers and our business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-10">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">AI-Driven Fraud Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We use AI and machine learning to analyze massive volumes of transaction data in real time, identifying anomalies and predicting fraud.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">Blockchain for Secure, Transparent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Blockchain provides a decentralized, tamper-proof ledger for all transactions, enhancing transparency and reducing fraud.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">Multi-Factor Authentication (MFA) &amp; Biometric Security</CardTitle>
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
        <section id="contact" className="w-full flex justify-center py-12 md:py-24 lg:py-32 border-t bg-background">
          <div className="w-full max-w-2xl grid items-center justify-center gap-6 px-4 text-center md:px-8 mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Building a more secure future for retail.
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground md:text-xl">
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