import Link from "next/link";
import Nav from "@/widgets/nav";
import SiteFooter from "@/widgets/site-footer";
import { Arrow } from "@/shared/ui/Arrow";

export default function NotFound() {
  return (
    <main className="relative text-[color:var(--text)] grain min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 flex items-center">
        <div className="mx-auto max-w-[900px] w-full px-6 md:px-10 py-20 text-center">
          <div className="eyebrow text-[color:var(--red)]">
            Ошибка 404
          </div>

          <h1 className="huge mt-6">
            <span className="num-lg block text-[color:var(--accent)] leading-[0.85]">
              404
            </span>
            <span className="block mt-4">
              Страница{" "}
              <em className="not-italic text-[color:var(--accent)] font-display italic font-[500]">
                не найдена
              </em>
              .
            </span>
          </h1>

          <p className="mt-8 mx-auto max-w-[520px] text-[17px] leading-[1.55] text-[color:var(--text-dim)]">
            Возможно, ссылка устарела или адрес введён с опечаткой.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-primary">
              На главную <Arrow />
            </Link>
            <Link href="/dashboard" className="btn-ghost">
              Открыть&nbsp;дашборд
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
