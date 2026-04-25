const PERSONAS = [
  {
    t: "Разработчики",
    b: "Узнай вилку своего стека за 30 секунд. Приходи на оффер-колл с цифрами, а не с ощущениями. Сохраняй трекер своей рыночной ценности.",
  },
  {
    t: "Тимлиды",
    b: "Понимай сколько стоит твоя команда на рынке. Защищай бюджет на рост зарплат перед финдиром — ссылкой на данные, а не на «все жалуются».",
  },
  {
    t: "Рекрутеры",
    b: "Отстраивай вилки от реальности до публикации вакансии. Видишь что конкуренты дают выше — корректируешь без раунда согласований.",
  },
  {
    t: "Студенты",
    b: "Выбираешь куда прокачиваться — фронт, бэк, инфра? Смотришь какой стек реально платит в Астане и Алматы через 1–2 года. Не по слухам.",
  },
];

export default function Personas() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <span className="eyebrow">[&nbsp;04&nbsp;] &nbsp;&nbsp;For whom</span>
            <h2 className="large mt-4">
              Кому это нужно<em className="font-display italic text-[color:var(--accent)]">.</em>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--border)]">
          {PERSONAS.map((p, i) => (
            <div key={i} className="bg-[color:var(--bg)] p-8 md:p-10 relative">
              <span className="font-mono text-[10px] tracking-[0.14em] text-[color:var(--muted)]">
                0{i + 1}
              </span>
              <h3 className="mt-6 medium text-[1.65rem] md:text-[1.75rem]">{p.t}</h3>
              <p className="mt-4 text-[14px] text-[color:var(--text-dim)] leading-relaxed">
                {p.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
