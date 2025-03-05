import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('');

  return (
    <footer className="bg-muted py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Kris Chen</p>
      </div>
    </footer>
  );
}
