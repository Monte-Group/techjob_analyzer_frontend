export default function Manifesto() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-3">
            <span className="eyebrow">[&nbsp;01&nbsp;] &nbsp;&nbsp;Manifesto</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p className="medium text-[color:var(--text)]">
              Раньше ты гадал, сколько стоит твой{" "}
              <em className="font-display italic text-[color:var(--gold)]">Go+Kafka+k8s</em> в Алматы.
              Спрашивал в чатах. Получал тот ответ, который удобен
              советчику. <span className="text-[color:var(--text-dim)]">Теперь не надо.</span>
            </p>
            <p className="mt-8 max-w-[720px] text-[17px] leading-relaxed text-[color:var(--text-dim)]">
              Stack.kz читает каждую вакансию, которая появилась за последние 12 месяцев.
              Разбирает её на атомы — стек, уровень, оффер, компания, регион — и
              считает честную статистику. Ты видишь медиану, разброс, динамику и
              топ-работодателей за 3 секунды. Не за неделю в HR-спорах.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
