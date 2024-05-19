import Navbar from "@/components/Navbar";
import { SparklesCore } from "@/components/ui/sparkles";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div style={{ zIndex: -1 }} className="w-full absolute inset-0 h-screen ">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={20}
         className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
        {children}
    </div>
  );
}
