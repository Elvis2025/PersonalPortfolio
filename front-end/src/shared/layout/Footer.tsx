import type { Lang } from '../../domain/portfolio.types';
import { copy } from '../../content/portfolio.content';

export function Footer({ lang }: { lang: Lang }) {
  const text = copy[lang];
  return (
    <footer id="footer" className="footer">
      <div className="container" data-aos="fade-up" data-aos-delay="120">
        <div className="copyright text-center ">
          <p>
            © <span>{text.copyright}</span> <strong className="px-1 sitename">Elvis Hernandez</strong>
            <span> {text.allRights}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
