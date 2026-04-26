import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/widgets/nav";
import SiteFooter from "@/widgets/site-footer";
import { Arrow } from "@/shared/ui/Arrow";
import { DOCS, DOC_SLUGS } from "@/entities/docs";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/docs/${doc.slug}` },
    openGraph: {
      title: doc.title,
      description: doc.summary,
      url: `/docs/${doc.slug}`,
      type: "article",
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  const others = DOC_SLUGS.filter((s) => s !== slug).map((s) => DOCS[s]);

  return (
    <main className="relative text-[color:var(--text)] grain">
      <Nav />

      <article className="mx-auto max-w-[920px] px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24 relative">
        <nav aria-label="Хлебные крошки" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase">
            <li>
              <Link
                href="/"
                className="text-[color:var(--text-dim)] hover:text-[color:var(--text)] transition-colors"
              >
                Главная
              </Link>
            </li>
            <li className="text-[color:var(--muted)]">/</li>
            <li>
              <Link
                href="/#docs"
                className="text-[color:var(--text-dim)] hover:text-[color:var(--text)] transition-colors"
              >
                Docs
              </Link>
            </li>
            <li className="text-[color:var(--muted)]">/</li>
            <li className="text-[color:var(--text)]" aria-current="page">
              {doc.eyebrow}
            </li>
          </ol>
        </nav>

        <header className="hairline-b pb-10">
          <h1 className="large mt-2">{doc.title}</h1>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--muted)]">
            <span>Редакция от {doc.updated}</span>
            <span className="text-[color:var(--faint)]">·</span>
            <span>ТОО «J — AI» · БИН 250340012345</span>
          </div>
          <p className="mt-8 max-w-[640px] text-[16px] leading-relaxed text-[color:var(--text-dim)]">
            {doc.summary}
          </p>
        </header>

        <nav
          className="mt-10 panel hairline px-6 py-5 bg-[linear-gradient(135deg,rgba(124,108,255,0.08),transparent_42%)]"
          aria-label="Содержание документа"
        >
          <div className="eyebrow mb-3">Содержание</div>
          <ol className="space-y-2 font-mono text-[12px] tabular">
            {doc.sections.map((s, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span className="text-[color:var(--muted)] w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#s-${i + 1}`}
                  className="text-[color:var(--text-dim)] hover:text-[color:var(--accent-bright)] transition-colors"
                >
                  {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 divide-hair">
          {doc.sections.map((s, i) => (
            <section
              key={i}
              id={`s-${i + 1}`}
              className="py-10 scroll-mt-24"
            >
              <div className="grid grid-cols-12 gap-6 md:gap-8">
                <div className="col-span-12 md:col-span-3">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--muted)] tabular">
                    [&nbsp;{String(i + 1).padStart(2, "0")}&nbsp;]
                  </span>
                  <h2 className="medium text-[1.5rem] md:text-[1.6rem] mt-3 leading-[1.15]">
                    {s.h.replace(/^\d+\.\s*/, "")}
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-9 space-y-5 text-[15px] leading-relaxed text-[color:var(--text-dim)]">
                  {s.p.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-16 panel hairline px-6 md:px-8 py-6 flex flex-wrap items-center justify-between gap-4 bg-[linear-gradient(135deg,rgba(124,108,255,0.10),transparent_46%)]">
          <div>
            <div className="eyebrow mb-1">Вопросы по документу</div>
            <p className="text-[14px] text-[color:var(--text-dim)]">
              Напиши на{" "}
              <a
                href="mailto:legal@j-ai.kz"
                className="text-[color:var(--accent)] hover:text-[color:var(--accent-bright)]"
              >
                legal@j-ai.kz
              </a>
              {" "}— ответим в течение 3 рабочих дней.
            </p>
          </div>
          <a
            href="mailto:legal@j-ai.kz"
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--accent)] hover:text-[color:var(--accent-bright)] flex items-center gap-2"
          >
            написать <Arrow />
          </a>
        </aside>

        <div className="mt-14">
          <div className="eyebrow mb-5">Другие документы</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[color:var(--border)]">
            {others.map((d) => (
              <Link
                key={d.slug}
                href={`/docs/${d.slug}`}
                className="bg-[color:var(--surface)] p-6 group hover:bg-[color:var(--bg-2)] transition-colors"
                style={{ boxShadow: "inset 0 1px 0 rgba(124,108,255,0.08)" }}
              >
                <span className="eyebrow">{d.eyebrow}</span>
                <h3 className="mt-3 medium text-[1.25rem] leading-tight">
                  {d.title}
                </h3>
                <p className="mt-3 text-[13px] text-[color:var(--text-dim)] leading-relaxed">
                  {d.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--text-dim)] group-hover:text-[color:var(--accent-bright)] transition-colors">
                  читать <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
