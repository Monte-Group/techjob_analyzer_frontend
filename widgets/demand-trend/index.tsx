import Chart from "./Chart";

export default function DemandTrend() {
  return (
    <section className="hairline-t hairline-b py-20 md:py-28 bg-[color:var(--bg-2)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 items-end mb-10">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">[&nbsp;03&nbsp;] &nbsp;&nbsp;Demand · 12 месяцев</span>
            <h2 className="large mt-4">
              Спрос растёт{" "}
              <em className="font-display italic text-[color:var(--gold)]">
                там, где мало кто смотрит.
              </em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5">
            <p className="text-[15px] text-[color:var(--text-dim)] leading-relaxed">
              DevOps-инженеры и Go-разработчики подорожали быстрее всего за год.
              В то же время фронтенд стабилизировался — спрос высокий, но вилки
              растут по инфляции, не быстрее. Наведи на график.
            </p>
          </div>
        </div>
        <div className="panel p-6 md:p-10 hairline">
          <Chart />
        </div>
      </div>
    </section>
  );
}
