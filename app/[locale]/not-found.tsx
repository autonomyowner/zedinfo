import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-zed py-24 text-center">
      <div className="text-[120px] font-black text-primary leading-none">404</div>
      <p className="text-on-surface-variant mb-8 uppercase tracking-widest text-sm">
        Page not found
      </p>
      <Link href="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
