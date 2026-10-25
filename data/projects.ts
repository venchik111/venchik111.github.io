// featured: крупная карточка на две колонки; highlight — результат проекта.
export type Project = {
  name: string;
  description: string;
  contribution: string;
  stack: string[];
  repo: string;
  featured?: boolean;
  highlight: string;
};

export const projects: Project[] = [
  {
    name: "Transaction Analysis",
    description:
      "Учебный проект для анализа банковских операций: поиск по описанию и категории, JSON-сводка для главной страницы, Excel-отчёты о тратах и получение курсов валют и цен акций через API.",
    contribution:
      "Разработал обработку и поиск операций, формирование сводки и отчётов, интеграцию с API котировок. Подготовил тесты и инструкцию по запуску.",
    stack: ["Python", "pandas", "openpyxl", "requests", "pytest"],
    repo: "https://github.com/venchik111/transaction_analysis",
    featured: true,
    highlight: "Анализ операций, JSON-сводка и Excel-отчёты",
  },
  {
    name: "WebEducation",
    description:
      "Командная образовательная платформа для подготовки школьников 1–9 классов по спортивному программированию. Проект реализовывался с помощью ИИ-инструментов.",
    contribution:
      "Разрабатывал клиентскую часть и координировал работу LilRootDevelopers в роли капитана команды на хакатоне.",
    stack: ["Фронтенд", "ИИ-инструменты", "Командная работа"],
    repo: "https://github.com/D0UP1G/WebEducation",
    highlight: "Результат команды — платформа с курсами, заданиями, проверкой работ и прогрессом обучения",
  },
  {
    name: "BLITZ_ARENA",
    description:
      "Командный прототип платформы блиц-турниров по программированию 1 на 1. Проект реализовывался с помощью ИИ-инструментов.",
    contribution:
      "Разрабатывал клиентскую часть и координировал работу LilRootDevelopers в роли капитана команды на хакатоне.",
    stack: ["Фронтенд", "ИИ-инструменты", "Командная работа"],
    repo: "https://github.com/D0UP1G/FirsterChuv",
    highlight: "Результат команды — прототип с ролями администратора, участника и зрителя, редактором кода и картой матчей",
  },
  {
    name: "Nothing Interface for Ryoku",
    description:
      "Личный проект оформления рабочего стола Linux по мотивам Nothing OS. Проект реализовывался с помощью ИИ-инструментов.",
    contribution:
      "Работал с конфигурациями Linux, искал техническую информацию, объединял компоненты темы и виджеты. Подготовил скриншоты и инструкцию по установке.",
    stack: ["Linux", "Конфигурации", "ИИ-инструменты"],
    repo: "https://github.com/venchik111/ryoku-nothing-interface",
    highlight: "Опубликованный комплект: тема, шесть плагинов, экран блокировки и инструкция",
  },
];
